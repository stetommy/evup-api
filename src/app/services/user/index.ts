import { $UserModelCreateInterface, $UserValidationErrorsEnum } from '../../models/user/user.dto';
import { $ValidationResponse } from '../../models';
import UserModel from '../../models/user/user.model';
import userValidator from '../../models/user/user.validator';
import crypto from '../../helpers/crypto';
import rnd from '../../helpers/random';

class UserService {
  /**
   * Validate the data to create a new user. Check if user already exists.
   * This function will check if the necessary fields necessary to create a new user
   * are given or valid.
   * @param data the user data from signup request
   * @returns if the form is valid and eventually the error list.
   */
  static async isRegisterUserByEmailFormValid(data: $UserModelCreateInterface): Promise<$ValidationResponse> {
    /** check if user already exist */
    const exists = await UserModel.findOne({ email: data?.email });
    /** if already exist return error */
    if (exists) return { valid: false, errors: [$UserValidationErrorsEnum.USER_ALREADY_EXISTS] };
    /** else check if data model is valid */
    return userValidator().registerUserByEmailForm(data);
  }

  /**
   * Validate Login user form.
   * @param data the user data from login request
   * @returns if the form is valid and eventually the error list.
   */
  static async isLoginUserByEmailFormValid(data: { email: string; password: string }): Promise<$ValidationResponse> {
    const { email, password } = data;
    /** Retrieve the user from database */
    const user = await UserModel.findOne({ email: email });
    /** If the user does not exist, return error */
    if (!user) return { valid: false, errors: [$UserValidationErrorsEnum.USER_NOT_FOUND] };
    /** Check if email has been verified */
    if (!user.emailVerified) return { valid: false, errors: [$UserValidationErrorsEnum.EMAIL_NOT_VERIFIED] };
    /** Check if the password is matching the user password */
    const passwordMatchsPassword = await crypto().compare(password, user.password || '');
    if (!passwordMatchsPassword) {
      /** If not, check if password is matching the recovery pin */
      const passwordMatchsRecoveryPin = await crypto().compare(password, user.pwResetPin || '');
      /** If the password is not matching the recovery pin and the password return an error. */
      if (!passwordMatchsRecoveryPin)
        return { valid: false, errors: [$UserValidationErrorsEnum.PASSWORD_NOT_MATCHING] };
    }
    /** Check the syntax validity */
    const valid = userValidator().loginUserByEmailForm({ email: email || '', password: password || '' });
    /** If the format of form is not valid, return error */
    if (!valid.valid) return valid;
    /** Else return valid. */
    return { valid: true, errors: [] };
  }

  /**
   * This method will create a recovery pin to reset your password.
   * @param email email of the user to update password
   * @returns the new pin
   */
  static async createRecoveryPassworPin(email: string): Promise<string> {
    /** generate a new random pin */
    const pin = rnd().generateRandomAlphanumericCode(8);
    /** encrypt the new random pin */
    const encrypted = await crypto().encrypt(pin);
    /** push to db the encrypted pin */
    await UserModel.findOneAndUpdate({ email: email }, { pwResetPin: encrypted });
    /** return response */
    return pin;
  }

  /**
   * Validate the change password form.
   * @param data Data to check from the request body
   * @returns if the form is valid and eventually the error list.
   */
  static async isPasswordChangeUserByEmailFormValid(
    data: { password: string },
    uid: string,
  ): Promise<$ValidationResponse> {
    /** find the user to change password */
    const user = await UserModel.findById({ _id: uid });
    /** if user does not exist, return error */
    if (!user) return { valid: false, errors: [$UserValidationErrorsEnum.USER_NOT_FOUND] };
    /** else return if request body is valid to change the password */
    return userValidator().passwordChangeUserByEmailForm(data);
  }

  /**
   * Validate the email of user to change password with.
   * @param email email of the user who has forgotten the password
   * @returns if is valid or not;
   */
  static async isPasswordRecoveryUserByEmailFormValid(email: string): Promise<$ValidationResponse> {
    /** find the user to recover password */
    const user = await UserModel.findOne({ email: email });
    /** if user does not exist return null */
    if (!user) return { valid: false, errors: [$UserValidationErrorsEnum.USER_NOT_FOUND] };
    /** else return if the request body is valid to recover the password */
    return userValidator().passwordRecoveryUserByEmailForm(email);
  }
}

export default UserService;

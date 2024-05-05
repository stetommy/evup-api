import express from 'express';
import crypto from '../../../helpers/crypto';
import authenticateToken from '../../../middlewares/authenticate-token';
import { $UserValidationErrorsEnum } from '../../../models/user/user.dto';
import loadEnv from '../../../services/env';
import { sendSimpleEmail } from '../../../services/smtp';
import { $SmtpEmailsCustomIds } from '../../../services/smtp/smtp.dto';
import { buildEmailHtmlContext } from '../../../statics';
import UserModel from '../../../models/user/user.model';
import UserService from '../../../services/user/index';
import { Request, Response } from 'express';

const route = express.Router();
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/change', authenticateToken, changePasswordWithAuthToken);
route.post('/recover', askForPasswordRecoveryPin);

/**
 * Will change the password for authorized users.
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function changePasswordWithAuthToken(req: Request, res: Response) {
  try {
    const { password } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uid = (req as any)?.user?._id;
    /** Validity Check */
    const valid = await UserService.isPasswordChangeUserByEmailFormValid({ password: password }, uid!);
    if (!valid.valid) return res.status(400).json(valid.errors);
    /** Save old passowrd if errors occurs */
    const old = await UserModel.findById(uid);
    const oldPassword = old?.password;
    /** enctypt the password */
    const encrypted = await crypto().encrypt(password);
    /** Update Password */
    await UserModel.updateOne({ _id: uid }, { password: encrypted });
    /** Retrieve user with updated password */
    const updated = await UserModel.findById(uid);
    /** Check if password is chenged succesfull */
    if (!(await crypto().compare(password, updated?.password || ''))) {
      /** Re save old password if error occurs */
      await UserModel.updateOne({ _id: uid }, { password: oldPassword });
      return res.status(400).json([$UserValidationErrorsEnum.PASSWORD_NOT_CHANGED]);
    }
    /** Response */
    return res.status(200).json([$UserValidationErrorsEnum.SUCCESS]);
  } catch (err) {
    console.error('CHANGE PASSWORD ERROR =>', err);
    return res.status(500).json({ success: false, error: 'Recover password error' });
  }
}

/**
 * Will create a temporary recovery pin to login and change the password.
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function askForPasswordRecoveryPin(req: Request, res: Response) {
  try {
    const { email } = req.body;
    /** Validity Check */
    const user = await UserModel.findOne({ email: email });
    const valid = await UserService.isPasswordRecoveryUserByEmailFormValid(email);
    if (!valid.valid) return res.status(400).json(valid.errors);
    /** Create recovery pin */
    const pin = await UserService.createRecoveryPassworPin(email);
    /** Create HTML template */
    const html: string = await buildEmailHtmlContext('password-recovery.html', {
      username: `${user?.firstName} ${user?.lastName}`,
      pin: pin,
    });
    /** Send the email */
    sendSimpleEmail(env.NOREPLY_EMAIL, html, 'Password Reset Request', email, $SmtpEmailsCustomIds.PASSWORD_RECOVER)
      .then(() => {
        return res.status(200).json(['EMAIL_SENT']);
      })
      .catch((e) => {
        return res.status(e.status);
      });
  } catch (err) {
    console.error('RECOVER PASSWORD ERROR =>', err);
    return res.status(500).json({ success: false, error: 'Reset pin generation error' });
  }
}

export default route;

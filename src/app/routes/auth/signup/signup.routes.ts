import express from 'express';
import crypto from '../../../helpers/crypto';
import regex from '../../../helpers/regex';
import { $UserValidationErrorsEnum } from '../../../models/user/user.dto';
import loadEnv from '../../../services/env';
import { sendSimpleEmail } from '../../../services/smtp';
import { $SmtpEmailsCustomIds } from '../../../services/smtp/smtp.dto';
import { buildEmailHtmlContext, buildPageHtmlContext } from '../../../statics';
import UserModel, { IUser } from '../../../models/user/user.model';
import { Request, Response } from 'express';
import UserService from '../../../services/user/index';

const route = express.Router();
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/email', createUserWithEmailAndPassword);
route.get('/verification/:email', verifyEmailAddress);

/**
 * This function create a new user. (check the validation IT'S COMMENTED NOW)
 * @param req Request
 * @param res Response
 * @returns success: true or return the error
 */
async function createUserWithEmailAndPassword(req: Request, res: Response) {
  /** Load the data from body request */
  const data = req.body;
  /** Check the validity of the body request */
  const valid = await UserService.isRegisterUserByEmailFormValid(data);
  /** if the body is not valid, return errors list */
  if (!valid.valid) return res.status(400).json(valid.errors);
  /** Create a new user document */
  const user: IUser = await UserModel.create(data);
  /** Delete sensitive information from the user object */
  user.password = undefined;
  /** send the user object successfully created */
  const url = `${env.APP_PUBLIC_URL}/auth/signup/verification/${crypto().b64encode(user?.email || '')}`;
  /** Compose html string */
  const html: string = await buildEmailHtmlContext('address-verification.html', {
    username: `${user?.firstName} ${user?.lastName}`,
    url: url,
  });
  /** Send the email to verify account
   *    If the email is sent successfully we return the user successfully created,
   *    otherwise we give an error and delete the user since without an email to verify
   *    the user he will never be able to log in.
   */
  sendSimpleEmail(env.NOREPLY_EMAIL, html, 'Email Verification', user?.email || '', $SmtpEmailsCustomIds.VERIFY_ACCOUNT)
    .then(() => {
      return res.status(201).json({ success: true });
    })
    .catch(async (err) => {
      await UserModel.findOneAndDelete({ email: user?.email });
      console.error('CREATE USER ERROR => ', err);
      return res.status(500).json({ error: 'Unable to send email, user was not created' });
    });
}

/**
 * This function will verify the email address of a new user.
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function verifyEmailAddress(req: Request, res: Response) {
  const encodedEmail = req.params.email;
  /** decode b64 email */
  const email = crypto().b64decode(encodedEmail);
  /** check email validy*/
  if (!email || !regex().isEmailValid(email)) return res.status(400).json([$UserValidationErrorsEnum.INVALID_EMAIL]);
  /** Check if email has been already verified */
  const user = await UserModel.findOne({ email: email });
  if (user?.emailVerified) {
    const html = await buildPageHtmlContext('email-verification-error.html', { error: 'Already Verified' });
    /** Send the error response */
    return res.send(html);
  }
  /** update validity to true */
  const updatedUser = await UserModel.findOneAndUpdate({ email: email }, { emailVerified: true });
  /** Check if user has been update */
  if (!updatedUser) {
    const html = await buildPageHtmlContext('email-verification-error.html', { error: 'User not found' });
    /** Send the error response */
    return res.send(html);
  }
  /** Send the success response */
  const html = await buildPageHtmlContext('email-verification-success.html', {});
  return res.send(html);
}
export default route;

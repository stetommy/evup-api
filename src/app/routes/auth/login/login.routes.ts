import express from 'express';
import { Request, Response } from 'express';
import loadEnv from '../../../services/env';
import { $JwtUserInterface } from '../../../models/refresh-token/refresh-token.dto';
import cookies from '../../../services/cookies';
import UserService from '../../../services/user/index';
import UserModel from '../../../models/user/user.model';
import RefreshTokenService from '../../../services/token/index';
import { minioGetImageUrl } from '../../../services/media';

const route = express.Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/email', loginUserWithEmailAndPassword);
route.get('/logout', logoutUserDestroyTokens);

/**
 * Will authenticate user with email and password. (REMOVE THE TOKEN IT'S ONLY FOR TEST PURPOSE from Response)
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function loginUserWithEmailAndPassword(req: Request, res: Response) {
  try {
    /** Change password? */
    let changePassword = false;
    /** Load the data from body request */
    const { email, password } = req.body;
    /** Validate body data model */
    const valid = await UserService.isLoginUserByEmailFormValid({ email, password });
    if (!valid.valid) return res.status(400).json(valid.errors);
    /** Retrive user */
    const user = await UserModel.findOne({ email: email });
    /** Check if user must change password */
    const mustChangePassword = user?.pwResetPin;
    /** If user must change password set true to return it and delete the actual pin from db */
    if (mustChangePassword) {
      await UserModel.findOneAndUpdate({ email: user?.email }, { pwResetPin: null });
      changePassword = true;
    }
    /** Manage jwt auth tokens */
    const jwtUser = { email: user?.email, _id: user?._id, role: user?.role } as $JwtUserInterface;
    const accessToken = RefreshTokenService.generateAccessToken(jwtUser);
    /** Update the user refresh token */
    const refreshToken = await RefreshTokenService.updateRefreshToken(user?._id || '');
    // send cookie
    res = cookies.updateCookies(res, { refreshToken, accessToken });
    /** Update user last login */
    await UserModel.findOneAndUpdate({ email: email }, { lastLogin: new Date() });
    /** Fetch user image url if user has image*/
    let userImageUrl;
    if (user?.picture) {
      userImageUrl = await minioGetImageUrl(user?.picture || '', 604800);
    } else {
      userImageUrl = null;
    }
    /** Build the response object */
    const response = Object.freeze({
      success: true,
      lastLogin: user?.lastLogin,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
      isActive: user?.isActive,
      emailVerified: user?.emailVerified,
      conditionAccepted: user?.conditionAccepted,
      plan: user?.plan,
      dateRenew: user?.dateRenew,
      changePassword,
      description: user?.description,
      picture: userImageUrl
    });
    // return the response object
    return res.status(200).json(response);
  } catch (err) {
    console.error('LOGIN ERROR =>', err);
    return res.status(500).json({ error: 'Sever error' });
  }
}

/**
 * Will destroy saved cookie.
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function logoutUserDestroyTokens(req: Request, res: Response) {
  try {
    res = cookies.destroyCookies(res);
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error('LOGOUT ERROR => ', err);
    return res.status(500).json({ error: 'Sever error' });
  }
}

export default route;

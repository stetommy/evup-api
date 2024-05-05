import express from 'express';
import jwt from 'jsonwebtoken';
import loadEnv from '../../../services/env';
import { $AuthErrorEnum } from '../../../models/refresh-token/refresh-token.dto';
import cookies from '../../../services/cookies';
import RefreshTokenService from '../../../services/token/index';
import RefreshTokenModel from '../../../models/refresh-token/refresh-token.model';
import UserModel from '../../../models/user/user.model';
import { Request, Response } from 'express';

const route = express.Router();
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/refresh', refreshAuthTokenByRefreshToken);

/**
 * Will create a new auth token from a given refresh token.
 * @param req Request
 * @param res Response
 * @returns The updated cookie, and success or not
 */
async function refreshAuthTokenByRefreshToken(req: Request, res: Response) {
  /* const TokenWrapper = new wrapper.token(); */
  // OLD CODE => const refreshToken = req.body.refreshToken;

  const refreshToken = req.cookies['refresh-token'];
  /** Check token validity */
  if (!refreshToken) return res.status(401).json($AuthErrorEnum.INVALID_REFRESH_TOKEN);
  const exists = await RefreshTokenModel.findOne({ refreshToken: refreshToken });
  if (!exists) return res.status(403).json([$AuthErrorEnum.INVALID_REFRESH_TOKEN]);
  /** Authenticate Token */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, async (err: any, user: any) => {
    /** Retrive user from db */
    const dbUser = await UserModel.findById(user.uid, {email: 1, role: 1})
    /** If user doesn't exists return error */
    if(!dbUser) return res.status(404).json({success:false, error: 'errore'})
    if (err) return res.status(403).json($AuthErrorEnum.INVALID_REFRESH_TOKEN);
    const accessToken = RefreshTokenService.generateAccessToken({
      _id: user.uid,
      email: dbUser.email!, // user can't doesn't have email
      role: dbUser.role!, // stes de sora
    });
    
    /** Update the cookie just updated */
    res = cookies.updateCookies(res, { accessToken });
    /** Build the response object */
    const response = Object.freeze({
      success: true,
    });
    /** Return the response object */
    return res.status(200).json(response);
  });
}

export default route;

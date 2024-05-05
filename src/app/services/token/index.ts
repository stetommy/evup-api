import jwt from 'jsonwebtoken';
import loadEnv from '../env';
import RefreshTokenModel from '../../models/refresh-token/refresh-token.model';
import { $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';

const env = loadEnv();

class TokenService {
  /**
   * Generate new access token.
   * @param user The user jwt to authenticate
   * @returns new Access Token
   */
  static generateAccessToken(user: $JwtUserInterface): string {
    return jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  /**
   * Generate new refresh token.
   * @param user The user jwt to authenticate
   * @returns new refresh Token
   */
  static generateRefreshToken(user: { uid: string }): string {
    return jwt.sign(user, env.REFRESH_TOKEN_SECRET);
  }

  /**
   * Update the refresh token on new login request.
   * @param user the user to authenticate with JWT
   * @param uid the uid of the user to update Refresh token
   * @returns the new refresh Token
   */
  static async updateRefreshToken(uid: string): Promise<string> {
    const existingToken = await RefreshTokenModel.findOne({ uid });

    if (!existingToken) {
      // Generate a new refresh token
      const newRefreshToken = this.generateRefreshToken({ uid });
      // Create a new document in the collection
      await RefreshTokenModel.create({ uid, refreshToken: newRefreshToken });
      return newRefreshToken;
    }

    const newRefreshToken = this.generateRefreshToken({ uid });
    await RefreshTokenModel.findOneAndUpdate({ uid }, { refreshToken: newRefreshToken });
    return newRefreshToken;
  }
}

export default TokenService;

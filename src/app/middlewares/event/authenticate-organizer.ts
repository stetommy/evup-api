import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { UserRole } from '../../models/user/user.model';
import { $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';
import { AuthenticatedRequest } from './authenticated-request';

export async function authenticateOrganizer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await UserModel.findById(decoded._id);

    if (!user || (user.role !== UserRole.Promoter && user.role !== UserRole.Agency)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = {
      _id: user._id!.toString(), // Ensure _id is a string
      email: user.email!,
      role: user.role!,
    } as $JwtUserInterface;

    next();
  } catch (err) {
    console.error('AUTHENTICATION ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

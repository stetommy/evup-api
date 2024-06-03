import { Request } from 'express';
import { $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';

export interface AuthenticatedRequest extends Request {
  user?: $JwtUserInterface;
}

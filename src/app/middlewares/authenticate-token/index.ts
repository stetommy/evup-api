import jwt from 'jsonwebtoken'
import { $AuthErrorEnum, $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';
import loadEnv from '../../services/env';

const env = loadEnv()
/**
 * This middleware will authenticate user from access token taken from req header cookie.
 * @param req 
 * @param res 
 * @param next 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function authenticateToken(req:any, res:any, next:any){
    /** Load access token from request header cookie */
    const token = req.cookies['access-token'];
    /** Check if token exist */
    if(!token) return res.status(401).json([$AuthErrorEnum.UNAUTHORIZED]);
    /** Verify the token */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, env.ACCESS_TOKEN_SECRET,(err:any,user:any)=>{
        if(err) return res.status(403).json([$AuthErrorEnum.INVALID_AUTH_TOKEN]);
        req.user = user as $JwtUserInterface;
        next()
    })
}
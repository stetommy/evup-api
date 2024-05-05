import { $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';
import { Request, Response } from 'express';
import UserModel, { UserRole } from '../../models/user/user.model';

declare module 'express' {
    interface Request {
      user?:  $JwtUserInterface;
    }
}

/**
 * This middleware will check if the use is an istructor,
 * need to be used ONLY after authenticateToken function 
 * @param req 
 * @param res 
 * @param next 
 */
export default function instructorLimited (req: Request, res:Response, next:any){
    /** Check if user is loaded */
    if (!req.user){
        return res.status(400).json("User not loaded");
    }
    /** Check if user role is instructor */
    if (!(req.user.role === UserRole.Instructor)){
        return res.status(403).send("User is not an instructor");
    }
    /** Go next to function */
    next()
}

/**
 * **IMPORTANT** MUST CALLED AFTER AUTHENTICATETOKEN 
 * 
 * This middleware check if the user isactive to give him access to course data
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function isActiveLimited (req: Request, res: Response, next: any) {
    /** Check if user is loaded */
    if (!req.user){
        return res.status(400).json("User not loaded");
    }
    /** Find user, I know user must be loaded to arrive there */
    const user = await UserModel.findById(req.user._id)
    if (!(user!.isActive)) {
        return res.status(403).send("User is not active")
    }
    /** Go next to function */
    next()
}
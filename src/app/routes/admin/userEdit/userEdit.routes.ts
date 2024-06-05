import express from 'express';
import loadEnv from '../../../services/env';
import { Request, Response } from 'express';
import authenticateToken from '../../../middlewares/authenticate-token';
import { AdminLimited } from '../../../middlewares/limited-access';
import UserModel from '../../../models/user/user.model';

/** Router definition */
const route = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/makeorganizer/:userEmail', authenticateToken, AdminLimited, makeOrganizerFromEmail);

/**
 * This function make an user an organizer
 * @param req 
 * @param res 
 * @returns 
 */
async function makeOrganizerFromEmail(req: Request, res: Response) {
  try {
    /** Get data from body */
    const { userEmail } = req.params;
    /** Find the specified user */
    const user = await UserModel.findOne({email: userEmail})
    /** Check if the user exist */
    if (!user) return res.status(400).json({ success: false, error: 'User not found!' });
    /** Check if the user is an admin */
    if (user.role === 'admin') return res.status(400).json({ success: false, error: 'User is an Admin cant make Organizer' });
    /** Check if the user is already an organizer */
    if (user.role === 'organizer') return res.status(400).json({success: false, error: 'User is already an Organizer'});
    /** Update the user role to organizer */
    await UserModel.findOneAndUpdate({email: userEmail}, {role: 'organizer'});
    /** Return the sucess of operation */
    return res.status(200).json({ success: true });
  } catch (err) {
    /** Log error in console */
    console.error('MODIFY USER ROLE ERROR =>', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to modify user role. Please try again.' });
  }
}

export default route;

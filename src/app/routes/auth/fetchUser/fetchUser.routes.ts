import express from 'express';
import { Request, Response } from 'express';
import authenticateToken from '../../../middlewares/authenticate-token';
import UserModel from '../../../models/user/user.model';
// import { minioGetImageUrl } from '../../../services/files';

// Create a new router instance
const route = express.Router();

/**
 * Routes definitions
 */
route.get('/user', authenticateToken, fetchUser);

/**
 * Route functions
 */

/**
 * Updates the user image
 * @param req 
 * @param res 
 * @returns 
 */
async function fetchUser(req: Request, res: Response) {
    try {
        let user = await UserModel.findById(req.user!._id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        /** Fetch user image url if user has image*/
        let userImageUrl
        // if (user?.picture) {
        //     userImageUrl = await minioGetImageUrl(user?.picture || '', 604800);
        // } else {
        //     userImageUrl = null;
        // }
        
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
            changePassword: false,
            description: user?.description,
            // picture: userImageUrl
        });

        // Respond with the user data
        return res.status(200).json(response);
    } catch (err: any) {
        // Handle any errors that occur during the process
        console.error("FETCH USER ERROR => " + err);
        return res.status(500).json({ success: false, message: "Failed to fetch the user data" });
    }
}

export default route;
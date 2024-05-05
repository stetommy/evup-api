import express from 'express';
import { Request, Response } from 'express';
// import multer from 'multer';
import authenticateToken from '../../../middlewares/authenticate-token';
// import { minioUploadImage, minioRemoveImage } from '../../../services/files';
import UserModel, { IUser } from '../../../models/user/user.model';

// Create a new router instance
const route = express.Router();

/** Multer configuration */
// const storage = multer.memoryStorage(); // Store files in memory
// const upload = multer({ storage: storage });


/**
 * Routes definitions
 */
// route.post('/image', authenticateToken, upload.single('file'), UserImageUpdate);
// route.post('/description', authenticateToken, UserDescriptionUpdate);


/**
 * Route functions
 */

/**
 * Updates the user image
 * @param req 
 * @param res 
 * @returns 
 */
// async function UserImageUpdate(req: Request, res: Response) {
//     try {
//         // Get the uploaded image from the request
//         const image = req.file;

//         // Find the user by their email
//         const user = await UserModel.findOne({ email: req.user?.email });

//         // Check if no image is provided in the request
//         if (!image) {
//             return res.status(400).json({ success: false, error: 'No image provided' });
//         }

//         // If the user already has a picture, remove the previous picture
//         if (user?.picture) {
//             await minioRemoveImage(user.picture);
//         }

//         // Upload the new image using the minioUploadImage function
//         user!.picture = await minioUploadImage(req.file);

//         // Update the user's picture in the database
//         await UserModel.updateOne({ email: req.user?.email }, { picture: user!.picture });

//         // Respond with a success message if everything is completed
//         return res.status(200).json({ success: true, message: 'User image updated successfully' });
//     } catch (err: any) {
//         // Handle any errors that occur during the process
//         console.error("UPLOAD USER IMAGE ERROR => " + err);
//         return res.status(500).json({ success: false, message: "Failed to upload the user image" });
//     }
// }


/**
 * Updates the user description
 * @param req 
 * @param res 
 * @returns 
 */
// async function UserDescriptionUpdate(req: Request, res: Response) {
//     try {
//         // Get the user description from the request body
//         const description = req.body.description;

//         // Check if no description is provided in the request
//         if (!description) {
//             return res.status(400).json({ success: false, error: 'No description provided' });
//         }

//         // Update the user's description in the database
//         await UserModel.updateOne({ email: req.user?.email }, { description: description });

//         // Respond with a success message if the update is completed
//         return res.status(200).json({ success: true, message: 'User description updated successfully' });
//     } catch (err: any) {
//         // Handle any errors that occur during the process
//         console.error("USER DESCRIPTION ERROR => " + err);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }


export default route;
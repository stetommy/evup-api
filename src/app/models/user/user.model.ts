import mongoose, { Schema, Document } from 'mongoose';
import crypto from '../../helpers/crypto';

export enum UserRole {
    Admin = "admin",
    Promoter = "promoter",
    Agency = "agency",
    User = "user",
}

export interface IUser extends Document {
    _id?: string;
    lastLogin?: Date;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    email?: string;
    joinDate?: Date;
    isActive?: boolean;
    password?: string;
    pwResetPin?: string;
    emailVerified?: boolean;
    conditionAccepted?: boolean;
    picture?: string;
    description?: string;
    stripe_account_id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stripeSession?: any;
    phoneNumber?: string;
    phonePrefix?: string;
    plan?: string;
    dateRenew?: Date;
}

const UserSchema: Schema = new Schema({
    lastLogin: Date,
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.User,
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    joinDate: Date,
    isActive: {
        type: Boolean,
        default: false
    },
    password: String,
    pwResetPin: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    conditionAccepted: {
        type: Boolean,
        default: false
    },
    picture: String,
    description: {
        type: String,
        default: null
    },
    stripe_account_id: String,
    stripeSession: {},
    phoneNumber: String,
    phonePrefix: String,
    plan: String,
    dateRenew: Date,
});

UserSchema.pre<IUser>('save', async function (next) {
    if (this.password) {
        try {
            const encryptedPassword = await crypto().encrypt(this.password);
            this.password = encryptedPassword;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return next(error);
        }
    }
    next();
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;

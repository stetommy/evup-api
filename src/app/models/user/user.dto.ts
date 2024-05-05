// For import plan in to the user model
import { IPlan } from "../plan/plan.model";
type Plan = `${IPlan['name']}`;

/**
 * Define the user Model interface.
 */
enum role {
    Admin = "admin",
    Promoter = "promoter",
    Agency = "agency",
    User = "user",
}

export interface $UserModelInterface {
    _id?: string,
    password: string,
    lastLogin: Date | null,
    role?: role,
    firstName: string,
    lastName: string,
    email: string,
    joinDate: Date,
    isActive: boolean,
    pwResetPin?: string,
    emailVerified: boolean,
    conditionAccepted?: boolean,
    picture?: Record<string, never>,
    stripe_account_id?: string,
    stripeSession?: {
        id?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [url: string]: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [expires_at: number]: any;
    },
    phoneNumber?: string;
    phonePrefix?: string;
    plan?: Plan;
    dateRenew?: Date;
}

/**
 * Export a partial User model type for registration.
 */
export type $UserModelCreateInterface = Omit<$UserModelInterface, 'lastLogin' | 'isSuperUser' | 'joinDate' | 'emailVerified'>

export enum $UserValidationErrorsEnum {
    "SUCCESS" = "SUCCESS",
    "MISSING_PASSWORD" = "MISSING_PASSWORD",
    "INVALID_PASSWORD" = "INVALID_PASSWORD",
    "MISSING_FIRSTNAME" = "MISSING_FIRSTNAME",
    "MISSING_LASTNAME" = "MISSING_LASTNAME",
    "MISSING_EMAIL" = "MISSING_EMAIL",
    "INVALID_EMAIL" = "INVALID_EMAIL",
    "USER_ALREADY_EXISTS" = "USER_ALREADY_EXISTS",
    "USER_NOT_FOUND" = "USER_NOT_FOUND",
    "PASSWORD_NOT_MATCHING" = "PASSWORD_NOT_MATCHING",
    "INVALID_USERNAME" = "INVALID_USERNAME",
    "INVALID_FIRSTNAME" = "INVALID_FIRSTNAME",
    "INVALID_LASTNAME" = "INVALID_LASTNAME",
    "PASSWORD_NOT_CHANGED" = "PASSWORD_NOT_CHANGED",
    "EMAIL_NOT_VERIFIED" = "EMAIL_NOT_VERIFIED",
    "MISSING_PHONE" = "MISSING_PHONE",
    "INVALID_PHONE" = "INVALID_PHONE",

}


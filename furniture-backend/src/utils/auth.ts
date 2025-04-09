import { error } from "console";
import { constantErrorCode } from "../config/errorCode";

export const checkUserExit = (user: any) => {
    // Check if user already exists in the system
    if (user) {
        const error: any = new Error("User already exist");
        error.status = 409;
        error.code = constantErrorCode.userExit;
        throw error;
    }
};

export const checkUserNotExit = (user: any) => {
    // Check if user does not exist in the system
    if (!user) {
        const error: any = new Error("Invalid User");
        error.status = 401;
        error.code = constantErrorCode.unauthenticated;
        throw error;
    }
};

export const checkOtpErrorIfSameDate = (
    isSamedate: boolean,
    errorCount: number
) => {
    // Check if OTP has been entered incorrectly 5 times on the same day
    if (isSamedate && errorCount === 5) {
        const error: any = new Error(
            "OTP is worng for 5 times in one day. Please try again after 24 hours"
        );
        error.status = 401;
        error.code = constantErrorCode.overLimit;
        throw error;
    }
};

export const checkOtpRow = (otpRow: any) => {
    // Check if OTP record exists for the given phone number
    if (!otpRow) {
        const error: any = new Error("Phone Number is incorrect");
        error.status = 400;
        error.code = constantErrorCode.invalid;
        throw error;
    }
};

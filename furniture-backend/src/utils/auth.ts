import { error } from "console";

export const checkUserExit = (user: any) => {
    if (user) {
        const error: any = new Error("User already exist");
        error.status = 409;
        error.code = "ERROR_ALREADY_EXIST";
        throw error;
    }
};

export const checkOtpErrorIfSameDate = (
    isSamedate: boolean,
    errorCount: number
) => {
    if (isSamedate && errorCount === 5) {
        const error: any = new Error(
            "OTP is worng for 5 times in one day. Please try again after 24 hours"
        );
        error.status = 401;
        error.code = "ERROR_OVERLIMIT";
        throw error;
    }
};

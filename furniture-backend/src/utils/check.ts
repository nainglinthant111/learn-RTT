import { constantErrorCode } from "../config/errorCode";
import { createError } from "./error";

export const checkUploadFile = (file: any) => {
    if (!file) {
        // return next(createError("Invalid Image", 409, constantErrorCode.invalid));
        throw createError("Invalid Image", 409, constantErrorCode.invalid);
    }
};
export const checkModelisExit = (model: any) => {
    if (!model) {
        throw createError(
            "This model is not exist",
            409,
            constantErrorCode.invalid
        );
    }
};

import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { constantErrorCode } from "../../config/errorCode";
import { createOrUpdateSetting } from "../../services/settingService";

interface CustomRequeat extends Request {
    user?: any;
}
export const setMaintenance = [
    body("mode", "mode must be boolean").isBoolean(),
    async (req: CustomRequeat, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            return next(createError(error, 400, constantErrorCode.invalid));
        }
        const mode = req.body.mode;
        const value = mode ? "true" : "false";
        const message = mode
            ? "Successfully set Maintenance mode. "
            : "Successfully turn off Maintenance mode.";
        createOrUpdateSetting("maintenance", value);
        res.status(200).json({
            message,
        });
    },
];

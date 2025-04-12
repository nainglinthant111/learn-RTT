import { NextFunction, Request, response, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { constantErrorCode } from "../../config/errorCode";
interface CustomRequest extends Request {
    userId?: number;
}
export const changeLanguage = [
    query("lng", "Invalid language code")
        .trim()
        .notEmpty()
        .matches(/^[a-zA-Z]+$/)
        .isLength({ min: 2, max: 3 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = constantErrorCode.invalid;
            return next(error);
        }
        const { lng } = req.query;
        res.cookie("i18next", lng);
        res.status(200).json({
            message: req.t("changeLanguage", { lang: lng }),
        });
    },
];

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
    getUserByPhone,
    createOtp,
    getOtpByPhone,
    updateOtp,
} from "../services/authService";
import { checkOtpErrorIfSameDate, checkUserExit } from "../utils/auth";
import { generateOtp, generateToken } from "../utils/generate";
import bcrypt from "bcrypt";

export const register = [
    body("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = "ERROR_INVALID";
            return next(error);
        }
        let phone = req.body.phone;
        if (phone.slice(0, 2) == "09") {
            phone = phone.substring(2, phone.length);
        }
        // Check already user
        const user = await getUserByPhone(phone);
        checkUserExit(user);

        //Otp Sending Logic
        //generate otp
        //is sms otp can not be sent,response error
        //save otb to db

        // const otp = generateOtp();
        const otp = 123456; //for dev
        const salt = await bcrypt.genSalt(10);
        const hashOpt = await bcrypt.hash(otp.toString(), salt);
        const token = generateToken();

        const otpRow = await getOtpByPhone(phone);
        let result;
        if (!otpRow) {
            const otpData = {
                phone,
                otp: hashOpt,
                remenverToken: token,
                count: 1,
            };
            result = await createOtp(otpData);
        } else {
            const lastOtpRequest = new Date(
                otpRow.updatedAt
            ).toLocaleDateString();
            const today = new Date().toLocaleDateString();
            const isSameDate = lastOtpRequest === today;
            checkOtpErrorIfSameDate(isSameDate, otpRow.error);
            if (!isSameDate) {
                const otpData = {
                    phone,
                    otp: hashOpt,
                    remenverToken: token,
                    count: 1,
                    error: 0,
                };
                result = await updateOtp(otpRow.id, otpData);
            } else {
                if (otpRow.count === 3) {
                    const error: any = new Error(
                        "Otp is allow to request 3 times per day. Please try again after 24 hours"
                    );
                    error.status = 405;
                    error.code = "ERROR_OVERLIMIT";
                    return next(error);
                } else {
                    const otpData = {
                        phone,
                        otp: hashOpt,
                        remenverToken: token,
                        count: { increment: 1 },
                    };
                    result = await updateOtp(otpRow.id, otpData);
                }
            }
        }

        res.status(200).json({
            message: `We are Sending Otp to 09${result.phone}`,
            phone: result.phone,
            token: result.remenverToken,
        });
    },
];

export const verifyOtp = [
    body("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    body("otp", "Invalid Otp")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 6, max: 6 }),
    body("token", "Invalid Token").trim().notEmpty().escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = "ERROR_INVALID";
            return next(error);
        }
        res.status(200).json({ message: "verifyOtp" });
    },
];
export const confirmPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(200).json({ message: "confirmPassword" });
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(200).json({ message: "login" });
};

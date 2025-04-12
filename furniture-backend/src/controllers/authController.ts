import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import moment from "moment";
import jwt from "jsonwebtoken";
import {
    getUserByPhone,
    createOtp,
    getOtpByPhone,
    updateOtp,
    createUser,
    updateUser,
    getUserById,
} from "../services/authService";
import {
    checkOtpErrorIfSameDate,
    checkOtpRow,
    checkUserExit,
    checkUserNotExit,
} from "../utils/auth";
import { generateOtp, generateToken } from "../utils/generate";
import bcrypt from "bcrypt";
import { constantErrorCode } from "../config/errorCode";
import { sendOTP } from "../services/emailService";

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
            error.code = constantErrorCode.invalid;
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

        const otp = generateOtp();
        // const otp = 123456; //for dev
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
                    error.code = constantErrorCode.overLimit;
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
        // await sendOTP(phone, otp!.toString());
        res.status(200).json({
            message: `We are Sending Otp to 09${result.phone}`,
            phone: result.phone,
            token: result.remenverToken,
        });
    },
];

export const verifyOtp = [
    // Input validation for phone number
    body("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    // Input validation for OTP
    body("otp", "Invalid Otp")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 6, max: 6 }),
    // Input validation for token
    body("token", "Invalid Token").trim().notEmpty().escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate request body and handle validation errors
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = constantErrorCode.invalid;
            return next(error);
        }

        // Extract data from request body
        const { phone, otp, token } = req.body;

        // Check if user exists
        const user = await getUserByPhone(phone);
        checkUserExit(user);

        // Get OTP record from database
        const otpRow = await getOtpByPhone(phone);
        checkOtpRow(otpRow);

        // Check if OTP verification is being done on the same day
        const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        const isSameDate = lastOtpVerify === today;
        checkOtpErrorIfSameDate(isSameDate, otpRow!.error);

        // Verify token matches
        if (otpRow?.remenverToken !== token) {
            const otpData = {
                error: 5,
            };
            await updateOtp(otpRow!.id, otpData);
            const error: any = new Error("Token has worng");
            error.status = 400;
            error.code = constantErrorCode.attack;
            return next(error);
        }

        // Check if OTP has expired (2 minutes validity)
        const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 2;
        if (isExpired) {
            const error: any = new Error("Token has Expired");
            error.status = 400;
            error.code = constantErrorCode.otpExpired;
            return next(error);
        }

        // Verify OTP matches
        const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);
        if (!isMatchOtp) {
            // Update error count based on whether it's same day or not
            if (!isSameDate) {
                const otpData = {
                    error: 1,
                };
                await updateOtp(otpRow!.id, otpData);
            } else {
                const otpData = {
                    error: {
                        increment: 1,
                    },
                };
                await updateOtp(otpRow!.id, otpData);
            }
            const error: any = new Error("Otp is incorrect");
            error.status = 400;
            error.code = constantErrorCode.invalid;
            return next(error);
        }

        // Generate new verification token and update OTP record
        const verifyToken = generateToken();
        const otpData = {
            verifyToken,
            error: 0,
            count: 1,
        };

        const result = await updateOtp(otpRow!.id, otpData);

        // Return success response with verification token
        res.status(200).json({
            message: "OTP is successfully verified.",
            phone: result.phone,
            token: result.verifyToken,
        });
    },
];

export const confirmPassword = [
    // Input validation for phone number
    body("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    // Input validation for password (8 digits)
    body("password", "Password must be 8 digits")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 8, max: 8 }),
    // Input validation for token
    body("token", "Invalid Token").trim().notEmpty().escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate request body and handle validation errors
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = constantErrorCode.invalid;
            return next(error);
        }

        // Extract data from request body
        const { phone, password, token } = req.body;

        // Check if user exists
        const user = await getUserByPhone(phone);
        checkUserExit(user);

        // Get OTP record from database
        const otpRow = await getOtpByPhone(phone);
        checkOtpRow(otpRow);

        // Check for potential security attack
        if (otpRow?.error === 5) {
            const error: any = new Error(" This Request maybe attacked");
            error.status = 400;
            error.code = constantErrorCode.attack;
            return next(error);
        }

        // Verify token matches
        if (otpRow?.verifyToken !== token) {
            const otpData = {
                error: 5,
            };
            await updateOtp(otpRow!.id, otpData);
            const error: any = new Error("Invalid Otp");
            error.status = 400;
            error.code = constantErrorCode.attack;
            return next(error);
        }

        // Check if request has expired (10 minutes validity)
        const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 10;
        if (isExpired) {
            const error: any = new Error("Your Request is Expired");
            error.status = 403;
            error.code = constantErrorCode.requestExpired;
            return next(error);
        }

        // Hash password for secure storage
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const randToken = "I will replace reflesh token soon.";

        // Create user data object
        const userData = {
            phone,
            password: hashPassword,
            randonToken: randToken,
        };

        // Create new user in database
        const newUser = await createUser(userData);

        // Generate JWT tokens
        const accessPayload = {
            id: newUser.id,
        };
        const refleshPayload = {
            id: newUser.id,
            phone: newUser.phone,
        };

        // Sign JWT tokens with expiration times
        const accessToken = jwt.sign(
            accessPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 } // 15 minutes
        );
        const refreshToken = jwt.sign(
            refleshPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: 60 * 15 } // 15 minutes
        );

        // Update user with refresh token
        const userUpdateData = {
            randonToken: refreshToken,
        };
        await updateUser(newUser.id, userUpdateData);

        // Set secure HTTP-only cookies and send success response
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 15, // 15 minutes
        })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
            })
            .status(201)
            .json({
                message: "Successfully created an account.",
            });
    },
];

export const login = [
    // Input validation for phone number
    body("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    // Input validation for password (8 digits)
    body("password", "Password must be 8 digits")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 8, max: 8 }),
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate request body and handle validation errors
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg);
            error.status = 400;
            error.code = constantErrorCode.invalid;
            return next(error);
        }

        // Format phone number by removing '09' prefix if present
        let phone = req.body.phone;
        const password = req.body.password;
        if (phone.slice(0, 2) === "09") {
            phone = phone.substring(2, phone.length);
        }

        // Check if user exists in database
        const user = await getUserByPhone(phone);
        checkUserNotExit(user);

        // Check if user account is frozen
        if (user?.status === "FREEZE") {
            const error: any = new Error(
                "Your Account is temporarily locked. Please contact us."
            );
            error.status = 401;
            error.code = constantErrorCode.accountFreeze;
            return next(error);
        }

        // Verify password matches stored hash
        const isMatchPassword = await bcrypt.compare(password, user!.password);
        if (!isMatchPassword) {
            // Check if this is the first failed attempt today
            const lastRequestDate = new Date(
                user!.updatedAt
            ).toLocaleDateString();
            const isSameDate =
                lastRequestDate === new Date().toLocaleDateString();

            if (!isSameDate) {
                // Reset error count for new day
                const userData = {
                    errorLoginCount: 1,
                };
            } else {
                // Check if user has exceeded maximum failed attempts
                if (user!.errorLoginCount >= 2) {
                    // Freeze account after 3 failed attempts
                    const userData = {
                        status: "FREEZE",
                    };
                    await updateUser(user!.id, userData);
                } else {
                    // Increment failed attempt counter
                    const userData = {
                        errorLoginCount: {
                            increment: 1,
                        },
                    };
                    await updateUser(user!.id, userData);
                }
            }
            const error: any = new Error("Password is worng.");
            error.status = 401;
            error.code = constantErrorCode.invalid;
            return next(error);
        }

        // Generate JWT tokens for successful login
        const accessPayload = {
            id: user!.id,
        };
        const refleshPayload = {
            id: user!.id,
            phone: user!.phone,
        };

        // Sign JWT tokens with expiration times
        const accessToken = jwt.sign(
            accessPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 } // 15 minutes
        );
        const refreshToken = jwt.sign(
            refleshPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: 60 * 15 } // 15 minutes
        );

        // Reset error count and update refresh token
        const userUpdateData = {
            errorLoginCount: 0,
            randonToken: refreshToken,
        };
        await updateUser(user!.id, userUpdateData);

        // Set secure HTTP-only cookies and send success response
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 15, // 15 minutes
        })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
            })
            .status(200)
            .json({
                message: "Successfully login.",
            });
    },
];

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    // Check if refresh token exists
    if (!refreshToken) {
        const error: any = new Error("You are not authenticated user.");
        error.status = 401;
        error.code = constantErrorCode.unauthenticated;
        return next(error);
    }

    // Verify and decode the refresh token
    let decoded;
    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as {
            id: number;
            phone: string;
        };
        if (isNaN(decoded.id)) {
            const error: any = new Error("You are not authenticated user.");
            error.status = 401;
            error.code = constantErrorCode.unauthenticated;
            return next(error);
        }
    } catch (err: any) {
        // Handle invalid or expired refresh token
        err = new Error("You are not authenticated user.");
        err.status = 401;
        err.code = constantErrorCode.unauthenticated;
        return next(err);
    }

    // Check if user exists in database
    const user = await getUserById(decoded.id);
    checkUserNotExit(user);

    // Verify if the phone number in token matches user's phone number
    if (user?.phone !== decoded.phone) {
        const error: any = new Error("You are not authenticated user.");
        error.status = 401;
        error.code = constantErrorCode.unauthenticated;
        return next(error);
    }

    // Generate new random token and update user record
    const userUpdateData = {
        randonToken: generateToken(),
    };
    await updateUser(user.id, userUpdateData);

    // Clear access token cookie
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Send success response
    res.status(200).json({
        message: "Successfully logout.",
    });
};

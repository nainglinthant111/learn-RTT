import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { constantErrorCode } from "../config/errorCode";
import { getUserById, updateUser } from "../services/authService";
import { createError } from "../utils/error";

// Extend Request interface to include userId
interface CustomRequeat extends Request {
    userId?: number;
}

export const authCheck = (
    req: CustomRequeat,
    res: Response,
    next: NextFunction
) => {
    // Get access and refresh tokens from cookies
    const accessToken = req.cookies ? req.cookies.accessToken : null;
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    // Check if refresh token exists
    if (!refreshToken) {
        // If no refresh token is present, user is not authenticated
        return next(
            createError(
                "You are not authenticated user.",
                401,
                constantErrorCode.unauthenticated
            )
        );
    }

    const generateNewToken = async () => {
        let decodeRefreshToken;
        try {
            // Verify the refresh token signature and decode its payload
            decodeRefreshToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as {
                id: number;
                phone: string;
            };
        } catch (error: any) {
            // Handle invalid refresh token (tampered or expired)
            error = "You are not authenticated user.";
            return next(
                createError(error, 401, constantErrorCode.unauthenticated)
            );
        }
        // Validate that the decoded ID is a valid number
        if (isNaN(decodeRefreshToken.id)) {
            return next(
                createError(
                    "You are not authenticated user.",
                    401,
                    constantErrorCode.unauthenticated
                )
            );
        }
        // Check if user exists in database
        const user = await getUserById(refreshToken.id);
        if (!user) {
            return next(
                createError(
                    "You are not authenticated user.",
                    401,
                    constantErrorCode.unauthenticated
                )
            );
        }
        // Verify that the phone number in token matches user's phone
        if (user!.phone !== decodeRefreshToken.phone) {
            return next(
                createError(
                    "You are not authenticated user.",
                    401,
                    constantErrorCode.unauthenticated
                )
            );
        }
        // Verify that the refresh token matches the one stored in user's record
        if (user.randonToken !== refreshToken!) {
            return next(
                createError(
                    "You are not authenticated user.",
                    401,
                    constantErrorCode.unauthenticated
                )
            );
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
        const newAccessToken = jwt.sign(
            accessPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 } // 15 minutes
        );
        const newRefreshToken = jwt.sign(
            refleshPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: 1000 * 60 * 60 * 24 * 30 } // 30d
        );

        // Reset error count and update refresh token
        const userUpdateData = {
            randonToken: newRefreshToken,
        };
        await updateUser(user!.id, userUpdateData);

        // Set secure HTTP-only cookies and send success response
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 15, // 15 minutes
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
        });
        next();
    };

    // Check if access token exists
    if (!accessToken) {
        // If no access token, generate new tokens using refresh token
        generateNewToken();
    } else {
        // Verify and decode the access token
        let decoded;
        try {
            decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            ) as {
                id: number;
            };
            // Validate that the decoded ID is a valid number
            if (isNaN(decoded.id)) {
                const error: any = new Error("You are not authenticated user.");
                error.status = 401;
                error.code = constantErrorCode.unauthenticated;
                return next(
                    createError(
                        "You are not authenticated user.",
                        401,
                        constantErrorCode.unauthenticated
                    )
                );
            }
            // Add user ID to request object for use in subsequent middleware/routes
            req.userId = decoded.id;
            next();
        } catch (err: any) {
            // Handle token expiration error
            if (err.name === "TokenExpiredError") {
                // Generate new tokens if access token has expired
                generateNewToken();
            } else {
                // Handle invalid token error (potential attack)
                return next(
                    createError(
                        "Access token is invalid.",
                        401,
                        constantErrorCode.attack
                    )
                );
            }
        }
    }
};

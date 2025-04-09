import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequeat extends Request {
    userId?: number;
}
export const authCheck = (
    req: CustomRequeat,
    res: Response,
    next: NextFunction
) => {
    // Get tokens from cookies
    const accessToken = req.cookies ? req.cookies.accessToken : null;
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    // Check if refresh token exists - if not, user is not authenticated
    if (!refreshToken) {
        const error: any = new Error("You are not authenticated user.");
        error.status = 401;
        error.code = "Token_Unauthenticated";
        return next(error);
    }

    // Check if access token exists - if not, it has expired
    if (!accessToken) {
        const error: any = new Error("Access token has expired.");
        error.status = 401;
        error.code = "Token_AccessTokenExpired";
        return next(error);
    }

    let decoded;
    try {
        // Verify the access token using the secret key
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
            id: number;
        };
    } catch (err: any) {
        // Handle different types of JWT verification errors
        if (err.name === "TokenExpiredError") {
            // Token has expired - user needs to refresh
            err.message = "Access token has expired.";
            err.status = 401;
            err.code = "Token_AccessTokenExpired";
        } else {
            // Token is invalid - possible security issue
            err.message = "Access token is invalid.";
            err.status = 401;
            err.code = "Error_Attack";
        }
        return next(err);
    }

    // Set the user ID from the decoded token for use in subsequent middleware/routes
    req.userId = decoded.id;
    next();
};

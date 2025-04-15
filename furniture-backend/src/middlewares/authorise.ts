import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/authService";
import { checkUserNotExit } from "../utils/auth";
import { constantErrorCode } from "../config/errorCode";
import { create } from "domain";
import { createError } from "../utils/error";

interface CustomRequeat extends Request {
    userId?: number;
    user?: any;
}

export const authorise = (permission: boolean, ...roles: string[]) => {
    return async (req: CustomRequeat, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const user = await getUserById(userId!);
        checkUserNotExit(user);
        const result = roles.includes(user!.role);
        if (permission && !result) {
            return next(
                createError(
                    "This connection is not allow",
                    403,
                    constantErrorCode.unauthenticated
                )
            );
        }
        if (!permission && result) {
            return next(
                createError(
                    "This connection is not allow",
                    403,
                    constantErrorCode.unauthenticated
                )
            );
        }
        req.user = user;
        next();
    };
};

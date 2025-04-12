import { NextFunction, Request, Response } from "express";
import { constantErrorCode } from "../../config/errorCode";
import { User } from "@prisma/client";
import { checkUserNotExit } from "../../utils/auth";

interface CustomRequest extends Request {
    user?: User;
}

export const getAllUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    checkUserNotExit(user);
    res.status(200).json({
        message: req.t("welcome"),
        currentUserId: user!.id,
    });
};

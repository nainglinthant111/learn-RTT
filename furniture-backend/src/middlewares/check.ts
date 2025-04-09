import { Request, Response, NextFunction } from "express";
interface CustomRequeat extends Request {
    userId?: number;
}
export const check = (
    req: CustomRequeat,
    res: Response,
    next: NextFunction
) => {
    // const err: any = new Error("Token has Expired");
    // err.status = 401;
    // err.code = "Token_Expired";
    // return next(err);
    next();
};

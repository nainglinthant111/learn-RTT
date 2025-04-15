import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/settingService";
import { constantErrorCode } from "../config/errorCode";
import { createError } from "../utils/error";
const whiteList = ["127.0.0.1"];
export const maintenance = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (whiteList.includes(ip)) {
        console.log(`Allow Ip : ${ip}`);
        next();
    } else {
        const setting = await getSettingStatus("maintenance");
        console.log(`Not Allow Ip : ${ip}`);
        console.log(`Not Allow Ip : ${setting?.value}`);
        if (setting?.value === "true") {
            return next(
                createError(
                    "The server is currently under maintenance.Please try again leater.",
                    503,
                    constantErrorCode.maintenance
                )
            );
        }
    }
    next();
};

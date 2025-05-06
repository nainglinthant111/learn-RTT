import { NextFunction, Request, response, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import Path from "node:path";
import sharp from "sharp";

import { constantErrorCode } from "../../config/errorCode";
import { getUserById, updateUser } from "../../services/authService";
import { authorise } from "../../utils/authorise";
import { checkUserNotExit } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import ImageQueue from "../../jobs/queues/imageQueue";
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

export const testPermission = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExit(user);
    const can = authorise(true, user!.role, "AUTHOR");
    const info: any = {
        title: "test",
    };
    if (can) {
        info.content = "testcontent";
    }
    res.status(200).json({
        user,
        info,
    });
};

export const uploadProfile = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.userId;

    const image = req.file;
    const user = await getUserById(userId!);
    checkUserNotExit(user);
    checkUploadFile(image);
    if (user?.image) {
        const filePath = Path.join(
            __dirname,
            `../../../uploads/images/${user!.image}`
        );
        try {
            await unlink(filePath);
        } catch (error) {
            console.log(error);
        }
    }
    const fileName = image!.filename;
    const userData = {
        image: fileName,
    };
    await updateUser(userId!, userData);
    res.status(200).json({
        message: `upload profile is successfully ${fileName}`,
    });
};

export const uploadProfileMultiple = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.userId;
    const images = req.files;
    res.status(200).json({
        message: `multi upload profile is successfully`,
    });
};

export const uploadProfileOtp = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.userId;
    const image = req.file;
    const user = await getUserById(userId!);
    checkUserNotExit(user);
    checkUploadFile(image);

    const splitFileName = req.file?.filename.split(".")[0];
    await ImageQueue.add(
        "optmize-Image",
        {
            filePath: req.file?.path,
            fileName: `${splitFileName}.webp`,
            width: 200,
            height: 200,
            quality: 50,
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        }
    );
    try {
        if (user?.image) {
            const orgFilePath = Path.join(
                __dirname,
                `../../../uploads/images/${user!.image}`
            );
            const optimizeFilePath = Path.join(
                __dirname,
                `../../../uploads/optimizes/${user!.image.split(".")[0]}.webp`
            );
            await unlink(orgFilePath);
            await unlink(optimizeFilePath);
        }
    } catch (error) {
        console.log("image not found");
    }
    const userData = {
        image: req.file?.filename,
    };
    await updateUser(userId!, userData);
    res.status(200).json({
        message: `upload profile is successfully`,
    });
};

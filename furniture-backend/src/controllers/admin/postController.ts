import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import { createError } from "../../utils/error";
import { constantErrorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserExit, checkUserNotExit } from "../../utils/auth";
import { checkModelisExit, checkUploadFile } from "../../utils/check";
import ImageQueue from "../../jobs/queues/imageQueue";
import {
    createOnePost,
    deletePostById,
    getPostById,
    PostArgs,
    updatePostById,
} from "../../services/postServices";
import { unlink } from "node:fs/promises";
import Path from "node:path";
import { get } from "node:http";
import { cache } from "sharp";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
    userId?: number;
}

const removeBy = async (orgFile: string, optimizeFile: string | null) => {
    try {
        const orgFilePath = Path.join(__dirname, orgFile);
        await unlink(orgFilePath);
        if (optimizeFile) {
            const optimizeFilePath = Path.join(__dirname, optimizeFile);

            await unlink(optimizeFilePath);
        }
    } catch (error) {
        console.log("image not found");
    }
};
export const createPost = [
    body("title", "Title is required.").trim().notEmpty().escape(),
    body("content", "Content is required.").trim().notEmpty().escape(),
    body("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer((value) => sanitizeHtml(value))
        .notEmpty(),
    body("category", "Category is required.").trim().notEmpty().escape(),
    body("type", "Type is required.").trim().notEmpty().escape(),
    body("tags", "Type is invalid.")
        .optional({ nullable: true })
        .customSanitizer((value) => {
            if (value) {
                return value
                    .split(",")
                    .filter((tag: string) => tag.trim() !== "");
            }
            return value;
        }),

    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            if (req.file) {
                await removeBy(req.file.path, null);
            }
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const { title, content, body, category, type, tags } = req.body;
        const userId = req.userId;

        const image = req.file;
        checkUploadFile(image);
        const user = await getUserById(userId!);
        if (!user) {
            await removeBy(req.file!.filename, null);
            return next(
                createError(
                    "User not registered",
                    404,
                    constantErrorCode.unauthenticated
                )
            );
        }
        checkUserNotExit(user);
        const splitFileName = req.file?.filename.split(".")[0];
        await ImageQueue.add(
            "optmize-Image",
            {
                filePath: req.file?.path,
                fileName: `${splitFileName}.webp`,
                width: 835,
                height: 577,
                quality: 100,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000,
                },
            }
        );
        const data: PostArgs = {
            title,
            content,
            image: req.file!.filename,
            authorId: userId!,
            body,
            category,
            type,
            tags,
        };
        const post = await createOnePost(data);
        await cacheQueue.add("cache-invalidation", { pattern: "post:*" });
        res.status(201).json({
            message: `create post is successfully`,
            postId: post.id,
        });
    },
];

export const updatePost = [
    body("postId", "Id is required.").trim().notEmpty().isInt({ min: 1 }),
    body("title", "Title is required.").trim().notEmpty().escape(),
    body("content", "Content is required.").trim().notEmpty().escape(),
    body("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer((value) => sanitizeHtml(value))
        .notEmpty(),
    body("category", "Category is required.").trim().notEmpty().escape(),
    body("type", "Type is required.").trim().notEmpty().escape(),
    body("tags", "Type is invalid.")
        .optional({ nullable: true })
        .customSanitizer((value) => {
            if (value) {
                return value
                    .split(",")
                    .filter((tag: string) => tag.trim() !== "");
            }
            return value;
        }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            if (req.file) {
                await removeBy(req.file.path, null);
            }
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const { postId, title, content, body, category, type, tags } = req.body;
        const userId = req.userId;
        // checkUploadFile(req.file);
        const user = await getUserById(userId!);
        if (!user) {
            await removeBy(req.file!.filename, null);
            return next(
                createError(
                    "User not registered",
                    401,
                    constantErrorCode.unauthenticated
                )
            );
        }
        const post = await getPostById(+postId);
        if (!post) {
            await removeBy(req.file!.filename, null);
            return next(
                createError(
                    "Post does not exist",
                    401,
                    constantErrorCode.invalid
                )
            );
        }

        if (user.id !== post.autherId) {
            await removeBy(req.file!.filename, null);
            return next(
                createError(
                    "This action is not allowed",
                    403,
                    constantErrorCode.unauthenticated
                )
            );
        }
        const data: any = {
            title,
            content,
            image: req.file,
            body,
            category,
            type,
            tags,
        };
        if (req.file) {
            data.image = req.file.filename;
            const splitFileName = req.file?.filename.split(".")[0];
            await ImageQueue.add(
                "optmize-Image",
                {
                    filePath: req.file?.path,
                    fileName: `${splitFileName}.webp`,
                    width: 835,
                    height: 577,
                    quality: 100,
                },
                {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 1000,
                    },
                }
            );
            const optimizeFile = post.image.split(".")[0] + ".webp";
            await removeBy(post.image, optimizeFile);
        }
        const postUpdated = await updatePostById(+postId, data);
        await cacheQueue.add("cache-invalidation", { pattern: "post:*" });
        res.status(200).json({
            message: `Update post is successfully`,
            postId: postUpdated.id,
        });
    },
];
export const deletePost = [
    body("postId", "Id is required.").trim().notEmpty().isInt({ min: 1 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const { postId } = req.body;
        const user = await getUserById(req.userId!);
        checkUserNotExit(user);
        const post = await getPostById(+postId);
        checkModelisExit(post);
        if (user!.id !== post!.autherId) {
            await removeBy(req.file!.filename, null);
            return next(
                createError(
                    "This action is not allowed",
                    403,
                    constantErrorCode.unauthenticated
                )
            );
        }
        const postDeleted = await deletePostById(post!.id);
        const optimizeFile = post!.image.split(".")[0] + ".webp";
        await removeBy(post!.image, optimizeFile);
        await cacheQueue.add("cache-invalidation", { pattern: "post:*" });
        res.status(200).json({
            message: `Delete post is successfully`,
            postId: post!.id,
        });
    },
];

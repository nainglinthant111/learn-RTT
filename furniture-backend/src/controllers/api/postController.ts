import { Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { constantErrorCode } from "../../config/errorCode";
import { checkUserExit, checkUserNotExit } from "../../utils/auth";
import { getUserById } from "../../services/authService";
import {
    getPostById,
    getPostsList,
    getPostWithRelations,
} from "../../services/postServices";
import { title } from "process";
import { skip } from "@prisma/client/runtime/library";

interface CustomRequest extends Request {
    userId?: number;
}
export const getPost = [
    param("id", "Post id is required").isInt({ gt: 0 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const postId = req.params.id;
        const userId = req.userId;
        const user = await getUserById(userId!);
        checkUserNotExit(user);
        const post = await getPostWithRelations(+postId);

        res.status(200).json({
            message: "Get Post is ok!",
            post: post,
        });
    },
];
export const getPostsByPagination = [
    query("page", "Page number must be unsigned integer")
        .isInt({ gt: 0 })
        .optional(),
    query("limit", "Limit must be unsigned integer")
        .isInt({ gt: 4 })
        .optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const userId = req.userId;
        const user = getUserById(userId!);
        checkUserNotExit(user);
        const skip = (+page - 1) * +limit;
        const options = {
            skip,
            take: +limit + 1,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        };
        const posts = await getPostsList(options);
        const hasNext = posts.length > +limit;
        const proviousPage = +page > 1 ? +page - 1 : null;
        let nextPage = null;
        if (hasNext) {
            posts.pop();
            nextPage = +page + 1;
        }
        res.status(200).json({
            message: "Get Posts is ok!",
            currentPage: posts,
            previousPage: proviousPage,
            hasNextPage: hasNext,
            nextPage: nextPage,
        });
    },
];
export const getInfinitePostsByPagination = [
    query("cursor", "Page number must be unsigned integer")
        .isInt({ gt: 0 })
        .optional(),
    query("limit", "Limit must be unsigned integer")
        .isInt({ gt: 4 })
        .optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createError(errors[0].msg, 400, constantErrorCode.invalid)
            );
        }
        const cursor = req.query.cursor;
        const limit = req.query.limit || 5;
        const userId = req.userId;
        const user = getUserById(userId!);
        checkUserNotExit(user);
        const options = {
            take: +limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: +cursor } : undefined,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "asc",
            },
        };
        const posts = await getPostsList(options);
        const hasNext = posts.length > +limit;
        if (hasNext) {
            posts.pop();
        }
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
        res.status(200).json({
            message: "Get Posts infinite is ok!",
            hasNext,
            nextCursor,
            posts,
        });
    },
];

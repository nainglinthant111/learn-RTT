import { NextFunction, Request, Response } from "express";

interface CustomRequeat extends Request {
    userId?: number;
}

// http://localhost:8080/health
export const healthCheck = (req: CustomRequeat, res: Response) => {
    res.status(200).json({
        message: "Request is Ok!",
        userId: req.userId,
    });
};

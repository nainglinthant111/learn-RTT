import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";

import { limiter } from "./middlewares/rateLimiter";
import { check } from "./middlewares/check";

export const app = express();
interface CustomRequeat extends Request {
    userId?: number;
}

app.use(morgan("dev")) // morgan use log for req,res time
    .use(express.urlencoded({ extended: true })) // for request data
    .use(express.json()) //eg : Contact-Type:App;ication/json
    .use(cors()) // for cross origin resource sharing
    .use(helmet()) // for security
    .use(compression()) //decrease response size
    .use(limiter);

// http://localhost:8080/health
app.get("/health", check, (req: CustomRequeat, res: Response) => {
    throw new Error("An error occurs!");
    res.status(200).json({
        message: "Request is Ok!",
        userId: req.userId,
    });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Server Error ";
    const errorCode = error.code || "Error_Code";
    res.status(status).json({ message: message, error: errorCode });
});

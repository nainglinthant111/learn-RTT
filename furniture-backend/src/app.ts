import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { limiter } from "./middlewares/rateLimiter";
import { authCheck } from "./middlewares/auth";
import healthRoute from "./routes/v1/health";
import authRoute from "./routes/v1/auth";
import userRoute from "./routes/v1/admin/user";

export const app = express();

app.use(morgan("dev")) // morgan use log for req,res time
    .use(express.urlencoded({ extended: true })) // for request data
    .use(express.json()) //eg : Contact-Type:App;ication/json
    .use(cookieParser()) // for cookie
    .use(cors()) // for cross origin resource sharing
    .use(helmet()) // for security
    .use(compression()) //decrease response size
    .use(limiter)
    .use("/api/v1", healthRoute);

app.use("/api/v1", authRoute);
app.use("/api/v1/admins", authCheck, userRoute);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Server Error ";
    const errorCode = error.code || "Error_Code";
    res.status(status).json({ message: message, error: errorCode });
});

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

import { limiter } from "./middlewares/rateLimiter";
import { authCheck } from "./middlewares/auth";
import healthRoute from "./routes/v1/health";
import authRoute from "./routes/v1/auth";
import adminRoute from "./routes/v1/admin/user";
import userRoute from "./routes/v1/api/user";
import { authorise } from "./middlewares/authorise";

export const app = express();
const whitelist = ["http://example1.com", "http://localhost:5173"];
const corsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (error: Error | null, origin?: boolean) => void
    ) {
        if (!origin) return callback(null, true);
        if (whitelist.includes(origin!)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(morgan("dev")) // morgan use log for req,res time
    .use(express.urlencoded({ extended: true })) // for request data
    .use(express.json()) //eg : Contact-Type:App;ication/json
    .use(cookieParser()) // for cookie
    .use(cors(corsOptions)) // for cross origin resource sharing
    .use(helmet()) // for security
    .use(compression()) //decrease response size
    .use(limiter)
    .use("/api/v1", healthRoute);
i18next
    .use(backend)
    .use(middleware.LanguageDetector)
    .init({
        backend: {
            loadPath: path.join(
                process.cwd(),
                "src/locales",
                "{{lng}}",
                "{{ns}}.json"
            ),
        },
        detection: {
            order: ["querystring", "cookie"],
            caches: ["cookies"],
        },
        fallbackLng: "en",
        preload: ["en", "mm"],
        ns: ["translation"],
        defaultNS: "translation",
        load: "languageOnly",
    });
app.use(middleware.handle(i18next));

app.use("/api/v1", authRoute);
app.use("/api/v1/admins", authCheck, authorise(true, "ADMIN"), adminRoute);
app.use("/api/v1", userRoute);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Server Error ";
    const errorCode = error.code || "Error_Code";
    res.status(status).json({ message: message, error: errorCode });
});

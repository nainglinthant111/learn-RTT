import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";

import { limiter } from "./middlewares/rateLimiter";

export const app = express();

// helmet(), compression(), cors(), express.json()
app.use(morgan("dev")) // morgan use log for req,res time
    .use(express.urlencoded({ extended: true })) // for request data
    .use(express.json()) //eg : Contact-Type:App;ication/json
    .use(cors()) // for cross origin resource sharing
    .use(helmet()) // for security
    .use(compression()) //decrease response size
    .use(limiter);

// http://localhost:8080/health
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Request is Ok!",
    });
});

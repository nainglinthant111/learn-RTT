import { Worker } from "bullmq";
import { Redis } from "ioredis";
import sharp from "sharp";
import path from "node:path";
import { connection } from "../../config/redisClient";

const imageWorker = new Worker(
    "imageQueue",
    async (job) => {
        const { filePath, fileName, width, height, quality } = job.data;

        const optimizedImage = path.join(
            __dirname,
            `../../../uploads/optimizes/${fileName}`
        );
        await sharp(filePath)
            .resize(width, height)
            .webp({ quality: quality })
            .toFile(optimizedImage);
    },
    {
        connection,
    }
);

imageWorker.on("completed", (job) => {
    console.log("imageWorker completed job", job.id);
});

imageWorker.on("failed", (job: any, err) => {
    console.log("imageWorker failed job", job.id, err);
});

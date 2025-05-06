import { Worker } from "bullmq";
import sharp from "sharp";
import path from "node:path";
import { connection } from "../../config/redisClient";

export const cacheWorker = new Worker(
    "cache-invalidation",
    async (job) => {
        const { pattern } = job.data;
        await invalidCache(pattern);
    },
    {
        connection,
        concurrency: 5,
    }
);

cacheWorker.on("completed", (job) => {
    console.log("imageWorker completed job", job.id);
});

cacheWorker.on("failed", (job: any, err) => {
    console.log("imageWorker failed job", job.id, err);
});

const invalidCache = async (pattern: string) => {
    try {
        const stream = connection.scanStream({
            match: pattern,
            count: 100,
        });
        const pipeline = connection.pipeline();
        let totalkeys = 0;
        stream.on("data", (keys: string[]) => {
            if (keys.length > 0) {
                keys.forEach((key) => {
                    pipeline.del(key);
                    totalkeys++;
                });
            }
        });
        await new Promise<void>((resolve, reject) => {
            stream.on("end", async () => {
                try {
                    if (totalkeys > 0) {
                        await pipeline.exec();
                        console.log(`Invalidated ${totalkeys} keys`);
                    }
                    resolve();
                } catch (e) {
                    console.error("Cache Invalidation error : ", e);
                    reject(e);
                }
            });
            stream.on("error", (err) => {
                reject(err);
            });
        });
    } catch (e) {
        console.error("Cache Invalidation error : ", e);
        throw e;
    }
};

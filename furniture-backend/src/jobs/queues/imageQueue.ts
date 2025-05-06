import { Queue } from "bullmq";
import { connection } from "../../config/redisClient";

const ImageQueue = new Queue("imageQueue", {
    connection,
});

export default ImageQueue;

import { connection } from "../config/redisClient";

export const getOrSetpath = async (key: any, cb: any) => {
    try {
        const cashedData = await connection.get(key);
        if (cashedData) {
            return JSON.parse(cashedData);
        }
        const firstDate = await cb();
        await connection.setex(key, 3600, JSON.stringify(firstDate)); //1hr
        return firstDate;
    } catch (e) {
        console.log("Redis error :", e);
        throw e;
    }
};

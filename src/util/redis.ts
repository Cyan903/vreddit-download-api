import config from "../../config.json";
import { createClient } from "redis";

export const client = (() => {
    if (Object.values(config.redis)) {
        return createClient(config.redis);
    }

    return createClient();
})();

client.on("error", (err: any) => {
    throw err;
});

export const createRedis = async () => { 
    process.stdout.write("connecting to redis server...  ");
    await client.connect()

    process.stdout.write("done\n");
};
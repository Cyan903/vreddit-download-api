import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import config from "../config.json";
import server from "./util/server";
import { init } from "./util/ffmpeg";
import { createRedis } from "./util/redis";

const app = express();

app.use(morgan("[:date[iso]] [:status] :method :url"));
app.use(rateLimit({
    windowMs: parseInt(config.windowMs),
    max: parseInt(config.max),
    standardHeaders: true,
    legacyHeaders: false
}));

app.use("/", server);
app.use("/public", express.static("public"));
app.use((_, res) => {
    res.status(404).json({
        error: "Not found!",
    });
});

app.listen(config.port, async () => {
    await init();
    await createRedis();
    process.stdout.write(`vreddit-api started on port ${config.port}\n\n`);
});

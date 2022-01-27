import express from "express";
import morgan from "morgan";
import config from "../config.json";
import server from "./util/server";
import { init } from "./util/ffmpeg";

const app = express();

app.use(morgan("[:date[iso]] [:status] :method :url"));
app.use("/", server);
app.use((_, res) => {
    res.status(404).json({
        error: "Not found!",
    });
});

app.listen(config.port, async () => {
    await init();
    process.stdout.write(`vreddit-api started on port ${config.port}\n\n`);
});

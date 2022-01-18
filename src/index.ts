import express from "express";
import morgan from "morgan";
import got from "got";
import metascraper, { Metadata } from "metascraper";
import metascraperVideo from "metascraper-video";
import config from "../config.json";

const app = express();
app.use(morgan("[:date[iso]] :method :url"));

app.listen(config.port, () => {
    process.stdout.write(`vreddit-api started on port ${config.port}\n\n`);
});

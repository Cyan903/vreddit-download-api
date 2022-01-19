import express from "express";
import { getLinks } from "./main";
import config from "../../config.json";

const router = express.Router();

router.get("/", (_, res) => {
    res.json({
        code: 200,
        message: `API running on port ${config.port}.`,
        repo: "https://github.com/CyanPiano/vreddit-download-api"
    });
});

router.get("/r/:subreddit/:id", async (req, res) => {
    if (!req.params.subreddit || !req.params.id) {
        res.status(400).json({
            error: "Missing either subreddit or id.",
            code: 400,
        });

        return;
    }

    const links = await getLinks(
        `https://www.reddit.com/r/${req.params.subreddit}/comments/${req.params.id}`
    );

    res.status(links.code).json(links);
});

export default router;
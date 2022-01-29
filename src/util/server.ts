import express from "express";
import { getLinks } from "./main";
import { combineFiles } from "./ffmpeg";
import config from "../../config.json";

const router = express.Router();

router.get("/", (_, res) => {
    res.json({
        code: 200,
        message: `API running on port ${config.port}.`,
        repo: "https://github.com/CyanPiano/vreddit-download-api"
    });
});

router.get("/dl/:id/:quality", async (req, res) => {
    // Leaving DASH_audio hardcoded in because I don't think it will ever be different.
    const { id, quality } = req.params;

    const redirect = await combineFiles(
        `https://v.redd.it/${id}/${quality}`,
        `https://v.redd.it/${id}/DASH_audio.mp4`,
        id
    );

    if (redirect.code == 200) {
        res.redirect("/public/output/" + redirect.res);
        return;
    }

    res.status(redirect.code).send(redirect);
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
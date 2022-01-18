import express, { Router } from "express";
import { getLinks } from "./main";

const router = express.Router();

router.get("/", (req, res) => {

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
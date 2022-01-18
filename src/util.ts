import { Download } from "./types/videos";
import { Response } from "./types/sources";
import got from "got";
import metascraper from "metascraper";
import metascraperVideo from "metascraper-video";

type Links = {
    error: string,
    code: number
} | string[];

const scraper = metascraper([metascraperVideo()]);
const getXML = got.extend(require("got-xml")());

async function getVideoID(vid: string): Promise<string | number> {
    const { body: html, url } = await got(vid);
    const { video }: Download = await scraper({ html, url });

    // Video was not found. Must be a gif or image.
    return video ? new URL(video).pathname.split("/")[1] : 404;
}

export async function getLinks(url: string): Promise<Links> {
    const id = await getVideoID(url);
    const { statusCode, body }: {
        statusCode: number,
        body: unknown
    } = await getXML(
        `https://v.redd.it/${id}/DASHPlaylist.mpd`
    );

    if (id == 404) {
        return {
            error: "Request is not a video!",
            code: 404,
        };
    }

    if (statusCode != 200) {
        return {
            error: "Dash playlist not found.",
            code: 400,
        };
    }

    return (body as Response).MPD.Period[0].AdaptationSet[1].Representation.map(
        (vid) => `https://v.redd.it/${id}/${vid.BaseURL[0]}`
    );
}

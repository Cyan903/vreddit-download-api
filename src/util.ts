import { Download } from "./types/videos";
import { Response } from "./types/sources";
import got from "got";
import metascraper from "metascraper";
import metascraperVideo from "metascraper-video";

type Links = {
    code: number
    res: string | object
};

const scraper = metascraper([metascraperVideo()]);
const getXML = got.extend(require("got-xml")());

async function getVideoID(vid: string): Promise<string | number> {
    const { body: html, url } = await got(vid);
    const { video }: Download = await scraper({ html, url });

    // Video was not found. Must be a gif or image.
    return video ? new URL(video).pathname.split("/")[1] : 404;
}

function filterVideo(mpd: Response, id: string): object {
    const data = mpd.MPD.Period[0].AdaptationSet;
    let videos, audio;

    for (let vid in data) {
        if (data[vid].$.contentType == "video") {
            videos = data[vid].Representation.map((vid) => {
                return {
                    height: vid.$.height,
                    width: vid.$.width,
                    framerate: vid.$.frameRate,
                    url: `https://v.redd.it/${id}/${vid.BaseURL[0]}`,
                }
            });
        } else if (data[vid].$.contentType == "audio") {
            audio = `https://v.redd.it/${id}/${data[vid].Representation[0].BaseURL[0]}`;
        }
    }

    return { id, videos, audio };
}

export async function getLinks(url: string): Promise<Links> {
    const id = await getVideoID(url);

    if (id == 404) {
        return {
            res: "Request is not a video!",
            code: 404,
        };
    }

    const { statusCode, body }: {
        statusCode: number,
        body: unknown
    } = await getXML(
        `https://v.redd.it/${id}/DASHPlaylist.mpd`
    );

    if (statusCode != 200) {
        return {
            res: "Dash playlist not found.",
            code: 400,
        };
    }

    return {
        code: 200,
        res: filterVideo(body as Response, String(id))
    }
}

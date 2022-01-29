import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import fs from "fs";
import got from "got";
import Queue from "promise-queue";
import config from "../../config.json";

const queue = new Queue(parseInt(config.maxConcurrent), parseInt(config.maxQueue));
const ffmpeg = createFFmpeg();

export const init = async () => {
    process.stdout.write("initializing ffmpeg.wasm...  ");
    await ffmpeg.load();

    process.stdout.write("done\n");
};

export async function combineFiles(video: string, audio: string, id: string): Promise<{ code: number; res: string; }> {
    // https://gist.github.com/CyanPiano/06d4da54b155ec904b2af0803e3b2ea3
    const time = Date.now();
    const vid = `.video.${time}.dl.mp4`;
    const aud = `.audio.${time}.dl.mp4`;
    let errResponse = false;

    const vidCode = await got.get(video).catch(() => { errResponse = true });
    const audCode = await got.get(audio).catch(() => { errResponse = true });

    if (errResponse) {
        return {
            code: 404,
            res: "Not found."
        }
    } else if (vidCode?.statusCode != 200 || audCode?.statusCode != 200) {
        return {
            code: vidCode?.statusCode || 500,
            res: "An error has occurred."
        }
    }
    
    try {
        await queue.add(async () => {
            got.stream(video).pipe(fs.createWriteStream(vid));
            got.stream(audio).pipe(fs.createWriteStream(aud));
    
            ffmpeg.FS("writeFile", vid, await fetchFile(video));
            ffmpeg.FS("writeFile", aud, await fetchFile(audio));
    
            await ffmpeg.run(
                "-i", vid,
                "-i", aud,
                "-c", "copy",
                "output.mp4"
            );
    
            const data = ffmpeg.FS("readFile", "output.mp4");
    
            fs.unlinkSync(vid);
            fs.unlinkSync(aud);
    
            await fs.promises.writeFile(`./public/output/${id}.${time}.mp4`, data);
        });

        return {
            code: 200,
            res: `${id}.${time}.mp4`
        }
    } catch {
        return {
            code: 500,
            res: "Error in ffmpeg.ts, combineFiles()"
        }
    }
}

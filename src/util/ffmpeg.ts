import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import fs from "fs";
import got from "got";
import Queue from "promise-queue";

var maxConcurrent = 1;
var maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);

const ffmpeg = createFFmpeg();

export const init = async () => {
    process.stdout.write(`initializing ffmpeg.wasm...  `);
    await ffmpeg.load();

    process.stdout.write(`done\n`);
};

export async function combineFiles(video: string, audio: string, id: string): Promise<{ code: number; res: string; }> {
    // https://gist.github.com/CyanPiano/06d4da54b155ec904b2af0803e3b2ea3
    const time = Date.now();
    const vid = `.video.${time}.dl.mp4`;
    const aud = `.audio.${time}.dl.mp4`;
    
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

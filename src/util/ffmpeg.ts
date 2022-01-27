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

export async function combineFiles(video: string, audio: string, id: string) {
    // https://gist.github.com/CyanPiano/06d4da54b155ec904b2af0803e3b2ea3
    const time = Date.now();

    queue.add(async () => {
        got.stream(video).pipe(fs.createWriteStream(`.video.${time}.dl.mp4`));
        got.stream(audio).pipe(fs.createWriteStream(`.audio.${time}.dl.mp4`));

        ffmpeg.FS("writeFile", `.video.${time}.dl.mp4`, await fetchFile(video));
        ffmpeg.FS("writeFile", `.audio.${time}.dl.mp4`, await fetchFile(audio));

        await ffmpeg.run(
            "-i", `.video.${time}.dl.mp4`,
            "-i", `.audio.${time}.dl.mp4`,
            "-c", "copy",
            "output.mp4"
        );

        const data = ffmpeg.FS("readFile", "output.mp4");

        fs.unlinkSync(`.video.${time}.dl.mp4`);
        fs.unlinkSync(`.audio.${time}.dl.mp4`);

        await fs.promises.writeFile(`./public/out/${id}.${time}.mp4`, data);
    });
}

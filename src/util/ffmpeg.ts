import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import fs from "fs";
import got from "got";

const ffmpeg = createFFmpeg();

export const init = async () => {
    process.stdout.write(`initializing ffmpeg.wasm...  `);
    await ffmpeg.load();

    process.stdout.write(`done\n`);
};

export async function combineFiles(video: string, audio: string) {
    // https://gist.github.com/CyanPiano/06d4da54b155ec904b2af0803e3b2ea3
    const time = Date.now();

    got.stream(video).pipe(fs.createWriteStream(`.video.${time}.dl.mp4`));
    got.stream(audio).pipe(fs.createWriteStream(`.audio.${time}.dl.mp4`));

    ffmpeg.FS("writeFile", `.video.${time}.dl.mp4`, await fetchFile(video));
    ffmpeg.FS("writeFile", `.audio.${time}.dl.mp4`, await fetchFile(audio));

    await ffmpeg.run(
        "-i",
        `.video.${time}.dl.mp4`,
        "-i",
        `.audio.${time}.dl.mp4`,
        "-c",
        "copy",
        "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");

    fs.unlinkSync(`.video.${time}.dl.mp4`);
    fs.unlinkSync(`.audio.${time}.dl.mp4`);

    await fs.promises.writeFile("./output.mp4", data);
}

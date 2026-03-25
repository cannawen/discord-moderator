import axios from "axios";
import { createTtsBuffer } from "./openAiClient";
import crypto from "crypto";
import fs = require("fs");
import path = require("path");

const TTS_DIRECTORY = "audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
  fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
  const hash = crypto.createHash("sha256").update(ttsString).digest("hex");
  return path.join(TTS_DIRECTORY, `${hash}.mp3`);
}

function create(ttsString: string): Promise<void> {
    const encodedAudio = encodeURIComponent(ttsString);
    return axios({
        method: "get",
        responseType: "stream",
        url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
    }).then((response) =>
        response.data.pipe(fs.createWriteStream(ttsPath(ttsString)))
    );
}

// Uses OpenAI but is out of credits atm
function _create(ttsString: string): Promise<void> {
  return createTtsBuffer(ttsString).then((buffer) => {
    fs.promises.writeFile(path.resolve(ttsPath(ttsString)), buffer);
  })
}

export default {
  create,
  path: ttsPath,
};

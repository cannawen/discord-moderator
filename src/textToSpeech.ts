import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import fs = require("fs");
import path = require("path");
import winston = require("winston");

const TTS_DIRECTORY = "audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
  fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
  const hash = crypto.createHash("sha256").update(ttsString).digest("hex");
  return path.join(TTS_DIRECTORY, `${hash}.mp3`);
}

function create(ttsString: string): Promise<AxiosResponse<any, any>> {
  return axios({
    url: "https://translate.google.com/translate_tts",
    params: {
      client: "tw-ob",
      ie: "UTF-8",
      q: ttsString,
      tl: "en",
    },
    responseType: "stream",
  })
    .then((response) =>
      response.data
        .pipe(fs.createWriteStream(ttsPath(ttsString)))
        .on("close", () => {})
    )
    .catch((error) => {
      winston.error(`unable to tts ${ttsString}`);
      winston.error(error);
      throw error;
    });
}

export default {
  create,
  path: ttsPath,
};

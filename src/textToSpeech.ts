import axios, { AxiosResponse } from "axios";
import fs = require("fs");
import path = require("path");

const TTS_DIRECTORY = "audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
  fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
  return path.join(TTS_DIRECTORY, `${ttsString}.mp3`);
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
      console.log("unable to tts", ttsString);
    });
}

export default {
  create,
  path: ttsPath,
};

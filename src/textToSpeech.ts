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
  return createTtsBuffer(ttsString).then((buffer) => {
    fs.promises.writeFile(path.resolve(ttsPath(ttsString)), buffer);
  })
}

export default {
  create,
  path: ttsPath,
};

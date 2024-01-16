import crypto from "crypto";
import fs = require("fs");
import OpenAI from "openai";
import path = require("path");
import winston = require("winston");
import constants from "./constants";

const openAi = new OpenAI({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

const TTS_DIRECTORY = "audio/tts-cache";
if (!fs.existsSync(TTS_DIRECTORY)) {
  fs.mkdirSync(TTS_DIRECTORY);
}

function ttsPath(ttsString: string) {
  const hash = crypto.createHash("sha256").update(ttsString).digest("hex");
  return path.join(TTS_DIRECTORY, `${hash}.mp3`);
}

async function create(ttsString: string): Promise<void> {
  // this cast to any is a bit suspect; but I think it may be the library's fault?
  const mp3: any = await openAi.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: ttsString,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(path.resolve(ttsPath(ttsString)), buffer);
}

export default {
  create,
  path: ttsPath,
};

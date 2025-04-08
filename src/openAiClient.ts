import constants from "./constants";
import OpenAi from "openai";

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

export function createImage(prompt: string): Promise<string> {
    return openAi.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        style: "natural",
        quality: "standard",
    }).then((completion) => {
        const response = completion.data[0].url;
        if (response) {
            return response;
        } else {
            throw "Did not recieve response";
        }
    });
}

export async function createTtsBuffer(ttsString: string): Promise<Buffer> {
    // this cast to any is a bit suspect; but I think it may be the library's fault?
    const mp3: any = await openAi.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: ttsString,
    });
  
    return Buffer.from(await mp3.arrayBuffer());
  }

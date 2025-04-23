import constants from "./constants";
import fs from "fs";
import OpenAi from "openai";

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

export function handleQuestion(question: string, system: string): Promise<string> {
  return openAi.chat.completions
    .create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
      model: "gpt-4o-mini",
    })
    .then((completion) => {
      const response = completion.choices[0].message.content;
      if (response) {
        return response;
      } else {
        throw new Error("Did not recieve response");
      }
    });
}

export function createImage(prompt: string): Promise<string> {
  return openAi.images.generate({
    model: "gpt-image-1",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  }).then((result) => {
    if (result.data) {
      const image_base64 = result.data[0].b64_json;
      if (image_base64) {
        const image_bytes = Buffer.from(image_base64, 'base64');
        fs.writeFileSync('image.png', image_bytes);
        return 'image.png'
      }
    }
    throw new Error("Did not receive image");
  })
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

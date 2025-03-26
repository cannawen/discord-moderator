import { findMember, findTextChannel, playAudio } from "../../helpers";
import constants from "../../constants";
import OpenAi from "openai";
import Rule from "../../Rule";
import winston from "winston";

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

function createImage(question: string): Promise<string> {
    return openAi.images.generate({
        model:"dall-e-3",
        prompt:question,
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

export default [
  new Rule({
    description: "draw me asks Dall-e to draw something",
    utterance: (utterance, memberId) => {
      const regex = utterance.match(/^(draw me|tommy) (.+)$/i)
      if (regex) {
        const prompt = regex[2];
        playAudio(`processing ${prompt}`)
        createImage(prompt).then((url) => {
          playAudio("success.mp3")
          findTextChannel(constants.discord.channelIds.BOTS).send(`_${prompt}_ by <@${memberId}> and <@${constants.discord.memberIds.CANNA_BOT}>`)
          findTextChannel(constants.discord.channelIds.BOTS).send(url)
          winston.info(
              `Question - ${utterance} (${findMember(memberId).displayName})`
          );
        }).catch((e) => {
          playAudio("error.mp3");
          winston.error(e);
        });
      }
    },
  }),
]

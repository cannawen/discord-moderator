import { findMember, findTextChannel, playAudio } from "../../helpers";
import constants from "../../constants";
import { createImage } from "../../openAiClient";
import Rule from "../../Rule";
import winston from "winston";

export default [
  new Rule({
    description: "draw me asks Dall-e to draw something",
    utterance: (utterance, memberId) => {
      const regex = utterance.match(/^(draw me|tommy|imagine) (.+)$/i)
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

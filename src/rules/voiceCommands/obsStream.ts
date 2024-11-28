import { findMember, findTextChannel, playAudio, voiceCommand } from "../../helpers";
import constants from "../../constants";
import obsClient from "../../obsClient";
import Rule from "../../Rule";
import winston from "winston";

export default [
  new Rule({
    description: "when someone says 'start stream', start Canna Stream",
    utterance: (utterance, memberId) => {
      if (utterance.match(/^(begin|start) stream(ing)?$/i)) {
        obsClient
          .streamCannaStart()
          .then(() => {
            voiceCommand("take me to streaming");
            findTextChannel(constants.channelIds.BOTS).send("Starting stream at https://www.twitch.tv/cannadota")
            winston.info(
              `OBS - Starting stream (${findMember(memberId).displayName})`
            );
          })
          .catch((e) => {
            playAudio("error.mp3");
            winston.error(`OBS - Unable to start stream`);
            winston.error(e);
          });
      }
    },
  }),

  new Rule({
    description: "when someone says 'end stream', stop Canna Stream",
    utterance: (utterance, memberId) => {
      if (utterance.match(/^(end|stop) stream(ing)?$/i)) {
        obsClient
          .streamCannaStop()
          .then(() => {
            playAudio("Stream ended.");
            voiceCommand("take me to general");
            winston.info(
              `OBS - Ending stream (${findMember(memberId).displayName})`
            );
          })
          .catch((e) => {
            playAudio("error.mp3");
            winston.error(`OBS - Unable to end stream`);
            winston.error(e);
          });
      }
    },
  }),
];

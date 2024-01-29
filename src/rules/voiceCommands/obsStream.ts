import { findMember, playAudio } from "../../helpers";
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
            playAudio("visit twitch dot tv slash canna dota");
            winston.info(
              `OBS - Starting stream (${findMember(memberId).displayName})`
            );
          })
          .catch((e) => {
            playAudio("Unable to start stream.");
            winston.error(`OBS - Unable to start stream`);
            winston.error(e);
          });
      }
    },
  }),

  new Rule({
    description: "when someone says 'end stream', start Canna Stream",
    utterance: (utterance, memberId) => {
      if (utterance.match(/^(end|stop) stream(ing)?$/i)) {
        obsClient
          .streamCannaStop()
          .then(() => {
            playAudio("Stream ended.");
            winston.info(
              `OBS - Ending stream (${findMember(memberId).displayName})`
            );
          })
          .catch((e) => {
            playAudio("Unable to end stream.");
            winston.error(`OBS - Unable to end stream`);
            winston.error(e);
          });
      }
    },
  }),
];

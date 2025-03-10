import {
  findMember,
  moveToVoiceChannel,
  playAudio,
  stopAudio,
} from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

let splittingMode = false;

export default [
  new Rule({
    description: '"should I stay or should I go" triggers splitting mode',
    utterance: (utterance) => {
      if (utterance.match(/^(should i stay or should i go|start in house)$/i)) {
        winston.info("In House - Splitting mode enabled");
        splittingMode = true;
        playAudio("shouldIStayOrShouldIGo.mp3");
      }
    },
  }),
  new Rule({
    description: 'if we are in splitting mode, listen to "radiant" (one) or "dire" (two)',
    utterance: (utterance, memberId) => {
      if (!splittingMode) return;

      if (utterance.match(/^(radiant|radiance|one|1)$/i)) {
        winston.info(
          `In House - Radiant - ${findMember(memberId).displayName
          } (${utterance})`
        );
        moveToVoiceChannel(memberId, constants.discord.channelIds.RADIANT);
      }
      if (utterance.match(/^(dyer|tire|dire|two|2)$/i)) {
        winston.info(
          `In House - Dire - ${findMember(memberId).displayName} (${utterance})`
        );
        moveToVoiceChannel(memberId, constants.discord.channelIds.DIRE);
      }
    },
  }),
  new Rule({
    description: "end splitting mode",
    utterance: (utterance, memberId) => {
      if (!splittingMode) return;

      if (
        utterance.match(/^(done|cancel|stop)$/) ||
        (utterance.match(/^(radiant|radiance|dyer|tire|dire)$/i) &&
          memberId === constants.discord.memberIds.CANNA)
      ) {
        winston.info("In House - Splitting mode disabled");
        splittingMode = false;
        stopAudio();
      }
    },
  }),
];

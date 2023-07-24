import { findMember, findVoiceChannel, playAudio, stopAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

let splittingMode = false;

export default [
  new Rule({
    description: '"should I stay or should I go" triggers splitting mode',
    utterance: (utterance) => {
      if (
        utterance.match(/^(should i stay or should i go)|(start in house)$/i)
      ) {
        splittingMode = true;
        playAudio("shouldIStayOrShouldIGo.mp3");
      }
    },
  }),
  new Rule({
    description: 'if we are in splitting mode, listen to "radiant" or "dire"',
    utterance: (utterance, memberId) => {
      if (splittingMode) {
        if (utterance.match(/^radiant|radiance$/i)) {
          findMember(memberId).voice.setChannel(
            findVoiceChannel(constants.channelIds.RADIANT)
          );
        }
        if (utterance.match(/^dyer|tire|dire$/i)) {
          findMember(memberId).voice.setChannel(
            findVoiceChannel(constants.channelIds.DIRE)
          );
        }
      }
    },
  }),
  new Rule({
    description: "end splitting mode",
    utterance: (utterance, memberId) => {
      if (
        utterance.match(/^done|cancel|stop$/) ||
        (utterance.match(/^radiant|radiance|dyer|tire|dire$/i) &&
          memberId === constants.memberIds.CANNA)
      ) {
        splittingMode = false;
        stopAudio();
      }
    },
  }),
];
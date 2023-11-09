import {
  disableAudioForAnHour,
  enableAudio,
  findMember,
  playAudio,
} from "../helpers";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "disable audio for an hour",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^enable audio$/i)) {
      winston.info(`Audio - Enabled (${findMember(memberId).displayName})`);
      enableAudio();
      playAudio("success.mp3");
    }
    if (utterance.match(/^disable audio$/i)) {
      winston.info(
        `Audio - Disabled for an hour (${findMember(memberId).displayName})`
      );
      playAudio("success.mp3");
      disableAudioForAnHour();
    }
  },
});

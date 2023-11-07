import { disableAudioForAnHour, enableAudio, findMember } from "../helpers";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "disable audio for an hour",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^enable audio$/i)) {
      winston.info(`Audio - Enabled (${findMember(memberId).displayName})`);
      enableAudio();
    }
    if (utterance.match(/^disable audio$/i)) {
      winston.info(
        `Audio - Disabled for an hour (${findMember(memberId).displayName})`
      );
      disableAudioForAnHour();
    }
  },
});

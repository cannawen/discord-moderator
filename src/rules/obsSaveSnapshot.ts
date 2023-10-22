import { findMember, playAudio } from "../helpers";
import constants from "../constants";
import obsClient from "../obsClient";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "when someone says 'snapshot' record OBS stream",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      winston.info(
        `OBS - Canna - triggering snapshot (${
          findMember(memberId).displayName
        })`
      );

      playAudio("photo.mp3");

      setTimeout(() => {
        if (findMember(constants.memberIds.CANNA).voice.channel) {
          obsClient
            .clipCanna()
            .catch(() => playAudio("error saving Canna clip"));
        }
        if (findMember(constants.memberIds.CANNA).voice.channel) {
          obsClient
            .clipTeazy()
            .catch(() => playAudio("error saving Teazy clip"));
        }
      }, 5 * 1000);
    }
  },
});

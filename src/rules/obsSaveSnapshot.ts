import { findMember, findMemberChannelId, playAudio } from "../helpers";
import constants from "../constants";
import obsClient from "../obsClient";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "when someone says 'snapshot' record OBS stream",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      winston.info(
        `OBS - triggering snapshot (${findMember(memberId).displayName})`
      );

      playAudio("photo.mp3");

      setTimeout(() => {
        if (findMemberChannelId(constants.memberIds.CANNA)) {
          obsClient
            .clipCanna()
            .catch(() => playAudio("error saving Canna clip"));
        }
      }, 10 * 1000);
    }
  },
});

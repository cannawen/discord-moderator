import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";
import winston from "winston";

const TIMEOUT_DURATION_IN_MS = 2 * 60 * 1000;

export default new Rule({
  description: "voice command to time out jproperly for 2 minutes",
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^mute jp$/i) &&
      memberId === constants.memberIds.CANNA
    ) {
      const jproperly = findMember(constants.memberIds.JPROPERLY);
      if (jproperly.voice.channel === null) {
        return;
      }
      winston.info("Mute JP");
      jproperly.edit({ mute: true });
      setTimeout(() => {
        winston.info("Unmute JP");
        jproperly.edit({ mute: false });
      }, TIMEOUT_DURATION_IN_MS);
    }
  },
});

import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";

const THREE_MINUTES_IN_MS = 3 * 60 * 1000;

export default new Rule({
  description: "voice command to time out jproperly for 3 minutes",
  utterance: (utterance, memberId) => {
    try {
      if (
        utterance.match(/^mute jp$/i) &&
        memberId === constants.memberIds.CANNA
      ) {
        const jproperly = findMember(constants.memberIds.JPROPERLY);
        jproperly.edit({ mute: true });
        setTimeout(() => {
          jproperly.edit({ mute: false });
        }, THREE_MINUTES_IN_MS);
      }
    } catch (_) {}
  },
});

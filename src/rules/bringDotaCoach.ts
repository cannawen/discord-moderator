import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";

export default new Rule({
  description: "bring dota-coach to a member's voice channel",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^coach me$/i)) {
      findMember(constants.memberIds.DOTA_COACH).voice.setChannel(
        findMember(memberId).voice.channel
      );
    }
  },
});

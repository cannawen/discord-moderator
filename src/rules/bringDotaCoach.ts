import { findMember, moveToVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

export default new Rule({
  description: "bring dota-coach to a member's voice channel",
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^coach me$/i) &&
      findMember(constants.memberIds.DOTA_COACH).voice.channel
    ) {
      moveToVoiceChannel(
        constants.memberIds.DOTA_COACH,
        findMember(memberId).voice.channelId!
      );
    }
  },
});

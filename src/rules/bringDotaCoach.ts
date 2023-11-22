import {
  findMember,
  findMemberVoiceChannelId,
  moveToVoiceChannel,
} from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "bring dota-coach to a member's voice channel",
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^coach me$/i) &&
      findMemberVoiceChannelId(constants.memberIds.DOTA_COACH)
    ) {
      winston.info(`Move - dota-coach to ${findMember(memberId).displayName}`);
      moveToVoiceChannel(
        constants.memberIds.DOTA_COACH,
        findMemberVoiceChannelId(memberId)!
      );
    }
  },
});

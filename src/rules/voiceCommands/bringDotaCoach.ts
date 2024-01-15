import {
  findMember,
  findMemberVoiceChannelId,
  moveToVoiceChannel,
} from "../../helpers";
import constants from "../../constants";
import https from "https";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
  description:
    "bring dota-coach to a member's voice channel, or start coaching session",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^coach me$/i)) {
      if (findMemberVoiceChannelId(constants.memberIds.DOTA_COACH)) {
        winston.info(
          `Move - dota-coach to ${findMember(memberId).displayName}`
        );
        moveToVoiceChannel(
          constants.memberIds.DOTA_COACH,
          findMemberVoiceChannelId(memberId)!
        );
      } else {
        winston.info(
          `Join - dota-coach to ${findMember(memberId).displayName}`
        );
        https
          .request({
            method: "POST",
            hostname: "dota-coach.fly.dev",
            path: `/coach/${constants.studentIds.CANNA}/start`,
          })
          .end();
      }
    }
  },
});

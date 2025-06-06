import {
  findMember,
  findMemberVoiceChannelId,
  findVoiceChannel,
  moveToVoiceChannel,
} from "../../helpers";
import constants from "../../constants";
import https from "https";
import Rule from "../../Rule";
import winston from "winston";

export default [
new Rule({
  description:
    "bring dota-coach to a member's voice channel, or start coaching session",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^coach me$/i)) {
      if (findMemberVoiceChannelId(constants.discord.memberIds.DOTA_COACH_NEW)) {
        winston.info(
          `Move - dota-coach to ${findMember(memberId).displayName}`
        );
        moveToVoiceChannel(
          constants.discord.memberIds.DOTA_COACH_NEW,
          findMemberVoiceChannelId(memberId)!
        );
      } else {
        winston.info(
          `Join - dota-coach to ${findMember(memberId).displayName}`
        );
        https
          .request({
            method: "POST",
            hostname: constants.dotaCoach.DOMAIN,
            path: `/coach/${constants.dotaCoach.CANNA_STUDENT_ID}/start`,
          })
          .end();
      }
    }
  },
}),

new Rule({
  description:
    "move dota-coach to Lobby",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^kick ?bot$/i) && findMemberVoiceChannelId(constants.discord.memberIds.DOTA_COACH)) {
      winston.info(
        `Move - dota-coach to Lobby`
      );
      moveToVoiceChannel(
        constants.discord.memberIds.DOTA_COACH,
        constants.discord.channelIds.LOBBY
      );
    }
  },
}),

new Rule({
  description:
    "move dota-coach to different channel than New Dota Coach",
  tick: () => {
    const dotaCoachChannel = findMemberVoiceChannelId(constants.discord.memberIds.DOTA_COACH);
    const newDotaCoachChannel = findMemberVoiceChannelId(constants.discord.memberIds.DOTA_COACH_NEW);
    if (dotaCoachChannel && dotaCoachChannel === newDotaCoachChannel) {
      const destination = dotaCoachChannel === constants.discord.channelIds.LOBBY
                          ? constants.discord.channelIds.FOCUS 
                          : constants.discord.channelIds.LOBBY;
      winston.info(
        `Move - dota-coach to ${findVoiceChannel(destination).name}`
      );
      moveToVoiceChannel(constants.discord.memberIds.DOTA_COACH, destination);
    }
  },
})
];

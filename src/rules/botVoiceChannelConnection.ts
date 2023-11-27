import {
  enableAudio,
  findGuild,
  findMember,
  findMemberVoiceChannelId,
  findVoiceChannel,
} from "../helpers";
import constants from "../constants";
import { joinVoiceChannel } from "@discordjs/voice";
import Rule from "../Rule";
import winston from "winston";

function joinBotToChannel(channelId: string | null | undefined) {
  if (
    channelId &&
    channelId !== findMemberVoiceChannelId(constants.memberIds.CANNA_BOT)
  ) {
    enableAudio();
    winston.info(
      `Bot ---------- connect ---------- ${findVoiceChannel(channelId).name}`
    );
    joinVoiceChannel({
      adapterCreator: findGuild().voiceAdapterCreator,
      channelId: channelId,
      guildId: constants.guildIds.BEST_DOTA,
      selfDeaf: false,
      selfMute: false,
    });
  }
}

export default new Rule({
  description: "on tick, manage bot connection to voice channel",
  tick: () => {
    const cannaChannel = findMemberVoiceChannelId(constants.memberIds.CANNA);
    const teazyChannel = findMemberVoiceChannelId(constants.memberIds.TEAZY);
    const botChannel = findMemberVoiceChannelId(constants.memberIds.CANNA_BOT);

    // connect to canna channel
    if (cannaChannel) {
      joinBotToChannel(cannaChannel);
    }
    // connect to teazy channel
    else if (teazyChannel) {
      joinBotToChannel(teazyChannel);
    }
    // disconnect if the bot is currently connected and there are only bots in the channel
    else if (
      botChannel &&
      findVoiceChannel(botChannel).members.filter(
        (member) =>
          member.id !== constants.memberIds.CANNA_BOT &&
          member.id !== constants.memberIds.DOTA_COACH
      ).size === 0
    ) {
      findMember(constants.memberIds.CANNA_BOT).voice.disconnect();

      winston.info(
        `Bot ---------- disconnect ---------- ${
          findVoiceChannel(botChannel).name
        }`
      );
    }
  },
});

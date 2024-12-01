import {
  enableAudio,
  filterBots,
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
    channelId !== findMemberVoiceChannelId(constants.discord.memberIds.CANNA_BOT)
  ) {
    enableAudio();
    winston.info(
      `Bot ---------- connect ----------------------- ${findVoiceChannel(channelId).name
      }`
    );
    joinVoiceChannel({
      adapterCreator: findGuild().voiceAdapterCreator,
      channelId: channelId,
      guildId: constants.discord.guildIds.BEST_DOTA,
      selfDeaf: false,
      selfMute: false,
    });
  }
}

export default new Rule({
  description: "on tick, manage bot connection to voice channel",
  tick: () => {
    const cannaChannel = findMemberVoiceChannelId(constants.discord.memberIds.CANNA);
    const teazyChannel = findMemberVoiceChannelId(constants.discord.memberIds.TEAZY);
    const botChannel = findMemberVoiceChannelId(constants.discord.memberIds.CANNA_BOT);

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
      filterBots(findVoiceChannel(botChannel).members).size === 0
    ) {
      findMember(constants.discord.memberIds.CANNA_BOT).voice.disconnect();

      winston.info(
        `Bot -------------------- disconnect ---------- ${findVoiceChannel(botChannel).name
        }`
      );
    }
  },
});

import { Events, VoiceBasedChannel } from "discord.js";
import { findMember, playAudio } from "../helpers";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import client from "../discordClient";
import constants from "../constants";
import Rule from "../Rule";
import obsClient from "../obsClient";

function joinChannel(channel: VoiceBasedChannel | null) {
  if (channel) {
    // join bot to channel
    joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: constants.guildIds.BEST_DOTA,
      selfDeaf: false,
      selfMute: false,
    });
  }
}

export default new Rule({
  description: "the bot joins whatever voice channel Canna is in",
  start: () => {
    joinChannel(
      findMember(constants.memberIds.CANNA).voice.channel ||
        findMember(constants.memberIds.TEAZY).voice.channel
    );

    client.on(Events.VoiceStateUpdate, (_, voiceStatus) => {
      if (
        voiceStatus.member?.id !== constants.memberIds.CANNA &&
        voiceStatus.member?.id !== constants.memberIds.TEAZY
      )
        return;

      const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
        .channel;
      const cannaChannel = findMember(constants.memberIds.CANNA).voice.channel;
      const teazyChannel = findMember(constants.memberIds.TEAZY).voice.channel;

      // if bot is not in Canna's channel
      if (cannaChannel && botChannel !== cannaChannel) {
        // join bot to Canna channel
        joinChannel(cannaChannel);
        obsClient.connect().catch(() => playAudio("error.mp3"));
      }
      // if Canna is not connected, and the bot is not in Teazy's channel
      if (!cannaChannel && teazyChannel && botChannel !== teazyChannel) {
        // connect bot to Teazy's channel
        joinChannel(teazyChannel);
      }

      // if Canna and Teazy are disconnected but the bot is still connected
      if (!cannaChannel && !teazyChannel && botChannel) {
        // disconnect bot
        getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
        obsClient.disconnect();
      }
    });
  },
});

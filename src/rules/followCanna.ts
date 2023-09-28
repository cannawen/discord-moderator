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
    joinChannel(findMember(constants.memberIds.CANNA).voice.channel);

    client.on(Events.VoiceStateUpdate, (_, voiceStatus) => {
      if (voiceStatus.member?.id !== constants.memberIds.CANNA) return;

      const cannaChannel = voiceStatus.channel;
      const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
        .channel;

      // if bot is currently in a channel different from Canna
      if (cannaChannel && botChannel !== cannaChannel) {
        // join bot to channel
        joinChannel(cannaChannel);
        obsClient.connect().catch(() => playAudio("error.mp3"));
      }

      // if Canna is not in a channel but bot is in a channel
      if (!cannaChannel && botChannel) {
        // disconnect bot
        getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
        obsClient.disconnect().catch(() => {});
      }
    });
  },
});

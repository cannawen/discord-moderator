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

    client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
      const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
        .channel;

      if (newVoiceState.member?.id === constants.memberIds.CANNA) {
        const cannaChannel = newVoiceState.channel;
        if (cannaChannel && botChannel !== cannaChannel) {
          joinChannel(cannaChannel);
        }

        if (cannaChannel && !oldVoiceState.channel) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna not connected"));
        }
        if (!cannaChannel) {
          obsClient.disconnectCanna();
        }
      }
      if (newVoiceState.member?.id === constants.memberIds.TEAZY) {
        const teazyChannel = newVoiceState.channel;
        if (teazyChannel && botChannel !== teazyChannel) {
          joinChannel(teazyChannel);
        }

        if (teazyChannel && !oldVoiceState.channel) {
          obsClient
            .connectTeazy()
            .catch(() => playAudio("Teazy not connected"));
        }

        if (!teazyChannel) {
          obsClient.disconnectTeazy();
        }
      }

      const cannaChannel = findMember(constants.memberIds.CANNA).voice.channel;
      const teazyChannel = findMember(constants.memberIds.TEAZY).voice.channel;
      if (!cannaChannel && !teazyChannel && botChannel) {
        // disconnect bot
        getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
      }
    });
  },
});

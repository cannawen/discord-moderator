import { findGuild, findMember, playAudio } from "../helpers";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import obsClient from "../obsClient";

function joinChannel(channel: string | null | undefined) {
  if (channel) {
    // join bot to channel
    joinVoiceChannel({
      adapterCreator: findGuild().voiceAdapterCreator,
      channelId: channel,
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
      findMember(constants.memberIds.CANNA).voice.channel?.id ||
        findMember(constants.memberIds.TEAZY).voice.channel?.id
    );

    client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
      console.log("Old Voice State", oldVoiceState.channelId);
      console.log("New Voice State", newVoiceState.channelId);
      const botChannel = findMember(constants.memberIds.CANNA_BOT).voice.channel
        ?.id;

      if (newVoiceState.member?.id === constants.memberIds.CANNA) {
        const cannaChannel = newVoiceState.channelId;
        if (cannaChannel && botChannel !== cannaChannel) {
          joinChannel(cannaChannel);
        }

        if (cannaChannel && !oldVoiceState.channelId) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna not connected"));
        }
        if (!cannaChannel) {
          obsClient.disconnectCanna();
        }
      }
      if (newVoiceState.member?.id === constants.memberIds.TEAZY) {
        const teazyChannel = newVoiceState.channelId;
        if (teazyChannel && botChannel !== teazyChannel) {
          joinChannel(teazyChannel);
        }

        if (teazyChannel && !oldVoiceState.channelId) {
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

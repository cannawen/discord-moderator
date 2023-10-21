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
      if (
        newVoiceState.member?.id === constants.memberIds.CANNA ||
        newVoiceState.member?.id === constants.memberIds.TEAZY
      ) {
        const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
          .channel;
        const cannaChannel = findMember(constants.memberIds.CANNA).voice
          .channel;
        const teazyChannel = findMember(constants.memberIds.TEAZY).voice
          .channel;

        // connecting the bot
        if (cannaChannel && botChannel !== cannaChannel) {
          // join bot to Canna channel
          joinChannel(cannaChannel);
        } else if (teazyChannel && botChannel !== teazyChannel) {
          //join bot to Teazy channel
          joinChannel(teazyChannel);
        }

        // connecting OBS to the bot
        if (cannaChannel && !oldVoiceState.channel) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna not connected"));
        }
        if (teazyChannel && !oldVoiceState.channel) {
          obsClient
            .connectTeazy()
            .catch(() => playAudio("Teazy not connected"));
        }

        if (!cannaChannel) {
          obsClient.disconnectCanna();
        }

        if (!teazyChannel) {
          obsClient.disconnectTeazy();
        }

        // if Canna and Teazy are disconnected but the bot is still connected
        if (!cannaChannel && !teazyChannel && botChannel) {
          // disconnect bot
          getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
        }
      }
    });
  },
});

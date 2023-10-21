import { findGuild, findMember, playAudio } from "../helpers";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import obsClient from "../obsClient";

function joinBotToChannel(channelId: string | null | undefined) {
  if (channelId) {
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
  description: "the bot joins whatever voice channel Canna is in",
  start: () => {
    joinBotToChannel(
      findMember(constants.memberIds.CANNA).voice.channel?.id ||
        findMember(constants.memberIds.TEAZY).voice.channel?.id
    );
    Promise.all([obsClient.connectCanna(), obsClient.connectTeazy()]).catch(
      (e) => console.log(e)
    );

    client.on(Events.VoiceStateUpdate, (oldVoiceState, _) => {
      const botChannel = findMember(constants.memberIds.CANNA_BOT).voice.channel
        ?.id;
      const cannaChannel = findMember(constants.memberIds.CANNA).voice.channel
        ?.id;
      const teazyChannel = findMember(constants.memberIds.TEAZY).voice.channel
        ?.id;

      if (oldVoiceState.member?.id === constants.memberIds.CANNA) {
        if (cannaChannel && botChannel !== cannaChannel) {
          joinBotToChannel(cannaChannel);
        }

        if (cannaChannel && !oldVoiceState.channelId) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna OBS not connected"));
        }

        if (!cannaChannel) {
          obsClient.disconnectCanna();
        }
      }

      if (oldVoiceState.member?.id === constants.memberIds.TEAZY) {
        if (teazyChannel && botChannel !== teazyChannel) {
          joinBotToChannel(teazyChannel);
        }

        if (teazyChannel && !oldVoiceState.channelId) {
          obsClient
            .connectTeazy()
            .catch(() => playAudio("Teazy OBS not connected"));
        }

        if (!teazyChannel) {
          obsClient.disconnectTeazy();
        }
      }

      if (!cannaChannel && !teazyChannel && botChannel) {
        getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
      }
    });
  },
});

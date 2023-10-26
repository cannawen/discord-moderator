import {
  findGuild,
  findMemberChannelId,
  findVoiceChannel,
  playAudio,
} from "../helpers";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import obsClient from "../obsClient";
import winston from "winston";

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

function findCannaChannelId() {
  return findMemberChannelId(constants.memberIds.CANNA);
}

function findTeazyChannelId() {
  return findMemberChannelId(constants.memberIds.TEAZY);
}

function findBotChannelId() {
  return findMemberChannelId(constants.memberIds.CANNA_BOT);
}

export default new Rule({
  description: "the bot joins whatever voice channel Canna is in",
  start: () => {
    if (findCannaChannelId()) {
      obsClient.connectCanna().catch(() => {
        playAudio("Canna OBS not connected on restart");
      });
    }

    if (findTeazyChannelId()) {
      obsClient.connectTeazy().catch(() => {
        playAudio("Teazy OBS not connected on restart");
      });
    }

    joinBotToChannel(findCannaChannelId() || findTeazyChannelId());

    client.on(Events.VoiceStateUpdate, (oldVoiceState, _) => {
      const botChannelId = findBotChannelId();
      const cannaChannelId = findCannaChannelId();
      const teazyChannelId = findTeazyChannelId();

      if (oldVoiceState.member?.id === constants.memberIds.CANNA) {
        if (cannaChannelId && botChannelId !== cannaChannelId) {
          winston.info(
            `---------- joining Canna's channel (${
              findVoiceChannel(cannaChannelId).name
            }) ----------`
          );
          joinBotToChannel(cannaChannelId);
        }

        if (cannaChannelId && !oldVoiceState.channelId) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna OBS not connected"));
        }

        if (!cannaChannelId) {
          obsClient.disconnectCanna();
        }
      }

      if (oldVoiceState.member?.id === constants.memberIds.TEAZY) {
        if (teazyChannelId && botChannelId !== teazyChannelId) {
          winston.info(
            `---------- joining Teazy's channel (${
              findVoiceChannel(teazyChannelId).name
            }) ----------`
          );
          joinBotToChannel(teazyChannelId);
        }

        if (teazyChannelId && !oldVoiceState.channelId) {
          obsClient
            .connectTeazy()
            .catch(() => playAudio("Teazy OBS not connected"));
        }

        if (!teazyChannelId) {
          obsClient.disconnectTeazy();
        }
      }

      if (!cannaChannelId && !teazyChannelId && botChannelId) {
        winston.info(`canna-bot - leaving voice channel`);
        setTimeout(() => {
          getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
        }, 10 * 1000);
      }
    });
  },
});

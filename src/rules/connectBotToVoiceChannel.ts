import {
  enableAudio,
  findGuild,
  findMemberVoiceChannelId,
  findVoiceChannel,
  playAudio,
} from "../helpers";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import client from "../discordClient";
import constants from "../constants";
import cron from "node-cron";
import { Events } from "discord.js";
import Rule from "../Rule";
import obsClient from "../obsClient";
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

function randomOccupiedVoiceChannelId(): string | undefined {
  return [
    ...findGuild().members.cache.reduce((memo, member) => {
      if (member.voice.channelId) {
        memo.add(member.voice.channelId);
      }
      return memo;
    }, new Set<string>()),
  ][0];
}

export default [
  new Rule({
    description: "on tick, manage bot connection to voice channel",
    tick: () => {
      const cannaChannel = findMemberVoiceChannelId(constants.memberIds.CANNA);

      const botChannel = findMemberVoiceChannelId(
        constants.memberIds.CANNA_BOT
      );

      // connect to canna channel
      if (cannaChannel) {
        joinBotToChannel(cannaChannel);
      }
      // connect to random occupied channel
      else if (!botChannel) {
        joinBotToChannel(randomOccupiedVoiceChannelId());
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
        getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
        winston.info(
          `Bot ---------- disconnect ---------- ${
            findVoiceChannel(botChannel).name
          }`
        );
      }
    },
  }),

  new Rule({
    description: "on restart, connect Canna's OBS",
    start: () => {
      const cannaChannel = findMemberVoiceChannelId(constants.memberIds.CANNA);

      if (cannaChannel) {
        obsClient.connectCanna().catch(() => {
          playAudio("Canna OBS not connected on restart");
        });
      }
    },
  }),

  new Rule({
    description: "on Canna join voice channel, connect OBS",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        if (
          newVoiceState.member?.id === constants.memberIds.CANNA &&
          !oldVoiceState.channelId &&
          newVoiceState.channelId
        ) {
          obsClient
            .connectCanna()
            .catch(() => playAudio("Canna OBS not connected"));
        }
      });
    },
  }),

  new Rule({
    description: "on Canna leave, disconnect OBS",
    start: () => {
      client.on(Events.VoiceStateUpdate, (_, newVoiceState) => {
        // if Canna is leaving a channel
        if (
          newVoiceState.member?.id === constants.memberIds.CANNA &&
          !newVoiceState.channelId
        ) {
          //disconnect OBS
          obsClient.disconnectCanna();
        }
      });
    },
  }),
];

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
      `---------- joining bot to voice channel (${
        findVoiceChannel(channelId).name
      }) ----------`
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

function allOccupiedVoiceChannels() {
  return findGuild().members.cache.reduce((memo, member) => {
    if (member.voice.channelId) {
      memo.add(member.voice.channelId);
    }
    return memo;
  }, new Set<string>());
}

export default [
  new Rule({
    description:
      "on restart, join the bot to Canna's channel or join to anyone's voice channel",
    start: () => {
      const cannaChannel = findMemberVoiceChannelId(constants.memberIds.CANNA);

      if (cannaChannel) {
        obsClient.connectCanna().catch(() => {
          playAudio("Canna OBS not connected on restart");
        });

        joinBotToChannel(cannaChannel);
      } else {
        joinBotToChannel([...allOccupiedVoiceChannels()][0]);
      }
    },
  }),

  new Rule({
    description:
      "on member join voice channel, join bot (prioritize Canna if people are in multiple voice channels)",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        // if member is joining a channel
        if (newVoiceState.channelId) {
          // if Canna is joining
          if (newVoiceState.member?.id === constants.memberIds.CANNA) {
            // if it is a fresh join; not moving from one channel to the other
            if (!oldVoiceState.channelId) {
              // connect OBS
              obsClient
                .connectCanna()
                .catch(() => playAudio("Canna OBS not connected"));
            }

              // connect bot to Canna's current channel
              joinBotToChannel(newVoiceState.channelId);
            }
          // if the bot is not connected
          else if (!findMemberVoiceChannelId(constants.memberIds.CANNA_BOT)) {
            //connect bot
            joinBotToChannel(newVoiceState.channelId);
          }
        }
      });
    },
  }),

  new Rule({
    description: "on Canna leave, disconnect OBS",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        // if Canna is leaving a channel
        if (
          !newVoiceState.channelId &&
          newVoiceState.member?.id === constants.memberIds.CANNA
        ) {
          //disconnect OBS
          obsClient.disconnectCanna();
        }
      });
    },
  }),

  new Rule({
    description:
      "on last member leave voice channel, try to join anyone else's channel",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        // if there is no one left in the channel (except for bots)
        if (
          oldVoiceState.channel?.members.filter(
            (member) =>
              member.id !== constants.memberIds.CANNA_BOT &&
              member.id !== constants.memberIds.DOTA_COACH
          ).size === 0
        ) {
          // disconnect from current channel
          getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();

          // search for a new channel to join
          const channels = allOccupiedVoiceChannels();
          channels.delete(oldVoiceState.channelId!);
          joinBotToChannel([...channels][0]);
        }
      });
    },
  }),
];

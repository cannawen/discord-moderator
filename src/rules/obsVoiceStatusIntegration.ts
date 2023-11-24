import { findMemberVoiceChannelId, playAudio } from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import obsClient from "../obsClient";

export default [
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

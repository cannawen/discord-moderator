import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import { findMember, findVoiceChannel } from "../helpers";

function wrabbitChannel() {
  return findMember(constants.memberIds.WRABBIT).voice.channelId;
}

function wrabbitAndTargetInSameChannel() {
  return (
    wrabbitChannel() !== null &&
    wrabbitChannel() === findMember(constants.memberIds.TARGET).voice.channelId
  );
}

let oldNameString: string | undefined;

export default new Rule({
  description:
    "When wrabbit and target are together in a channel, rename it Home",
  start: () => {
    client.on(Events.VoiceStateUpdate, (voiceState) => {
      if (
        voiceState.member?.id !== constants.memberIds.WRABBIT &&
        voiceState.member?.id !== constants.memberIds.TARGET
      ) {
        return;
      }

      if (wrabbitAndTargetInSameChannel()) {
        findVoiceChannel(wrabbitChannel()!).setName(
          constants.channelNames.HOME
        );
      } else {
        findVoiceChannel(constants.channelIds.GENERAL).setName(
          constants.channelNames.GENERAL
        );
        findVoiceChannel(constants.channelIds.DOTA_2).setName(
          constants.channelNames.DOTA_2
        );
        findVoiceChannel(constants.channelIds.SECRETS).setName(
          constants.channelNames.SECRETS
        );
        findVoiceChannel(constants.channelIds.REAL_SECRETS).setName(
          constants.channelNames.REAL_SECRETS
        );
      }
    });
  },
});

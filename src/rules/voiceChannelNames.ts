import { findMemberVoiceChannelId, findVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

function wrabbitChannel() {
  return findMemberVoiceChannelId(constants.memberIds.WRABBIT);
}

function wrabbitAndTargetInSameChannel() {
  return (
    wrabbitChannel() !== null &&
    wrabbitChannel() === findMemberVoiceChannelId(constants.memberIds.TARGET)
  );
}

function updateChannelName(channelId: string, newName: string) {
  const channel = findVoiceChannel(channelId);
  if (channel.name !== newName) {
    winston.info(`Rename - ${channel.name} to ${newName}`);
    channel.setName(newName);
  }
}

export default new Rule({
  description:
    "When wrabbit and target are together in a channel, rename it Home",
  tick: () => {
    if (wrabbitAndTargetInSameChannel()) {
      updateChannelName(wrabbitChannel()!, constants.channelNames.HOME);
    } else {
      updateChannelName(
        constants.channelIds.GENERAL,
        constants.channelNames.GENERAL
      );
      updateChannelName(
        constants.channelIds.DOTA_2,
        constants.channelNames.DOTA_2
      );
      updateChannelName(
        constants.channelIds.SECRETS,
        constants.channelNames.SECRETS
      );
      updateChannelName(
        constants.channelIds.REAL_SECRETS,
        constants.channelNames.REAL_SECRETS
      );
      updateChannelName(
        constants.channelIds.TIMEOUT,
        constants.channelNames.TIMEOUT
      );
      updateChannelName(
        constants.channelIds.LOBBY,
        constants.channelNames.LOBBY
      );
      updateChannelName(
        constants.channelIds.RADIANT,
        constants.channelNames.RADIANT
      );
      updateChannelName(constants.channelIds.DIRE, constants.channelNames.DIRE);
    }
  },
});

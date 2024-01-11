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
        constants.channelIds.CHAOS,
        constants.channelNames.CHAOS
      );
      updateChannelName(
        constants.channelIds.FOCUS,
        constants.channelNames.FOCUS
      );
      updateChannelName(
        constants.channelIds.HIDING,
        constants.channelNames.HIDING
      );
      updateChannelName(constants.channelIds.SHH, constants.channelNames.SHH);
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

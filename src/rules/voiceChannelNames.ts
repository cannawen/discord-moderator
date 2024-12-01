import { findMemberVoiceChannelId, findVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

function wrabbitChannel() {
  return findMemberVoiceChannelId(constants.discord.memberIds.WRABBIT);
}

function wrabbitAndTargetInSameChannel() {
  return (
    wrabbitChannel() !== null &&
    wrabbitChannel() === findMemberVoiceChannelId(constants.discord.memberIds.TARGET)
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
      updateChannelName(wrabbitChannel()!, constants.discord.channelNames.HOME);
    } else {
      // These channel names MUST match keys in both channelIds and channelNames
      [
        "GENERAL",
        "CHAOS",
        "FOCUS",
        "STREAMING",
        "HIDING",
        "WAITING",
        "LOBBY",
        "RADIANT",
        "DIRE",
      ].map((channelKey) =>
        // Extremely sketchy cast here to make the compiler happy
        updateChannelName(
          constants.discord.channelIds[channelKey as "GENERAL"],
          constants.discord.channelNames[channelKey as "GENERAL"]
        )
      );
    }
  },
});

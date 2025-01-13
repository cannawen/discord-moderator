import { findVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

function updateChannelName(channelId: string, newName: string) {
  const channel = findVoiceChannel(channelId);
  if (channel.name !== newName) {
    winston.info(`Rename - ${channel.name} to ${newName}`);
    channel.setName(newName);
  }
}

export default new Rule({
  description: "Have channel names be set by the bot",
  tick: () => {
    // These channel names MUST match keys in both channelIds and channelNames
    [
      "GENERAL",
      "CHAOS",
      "FOCUS",
      "STREAMING",
      "HIDING",
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
});

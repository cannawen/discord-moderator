import { Guild, VoiceBasedChannel } from "discord.js";
import Rule from "../Rule";
import constants from "../constants";

function moveMembersToLobby(guild: Guild, fromChannelId: string) {
  const fromChannel = guild.channels.cache.find(
    (c) => c.id === fromChannelId
  ) as VoiceBasedChannel;
  const toChannel = guild.channels.cache.find(
    (c) => c.id === constants.channelIds.LOBBY
  ) as VoiceBasedChannel;
  fromChannel?.members.forEach((m) => m.voice.setChannel(toChannel));
}

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (guild, utterance) => {
    if (utterance.match(/^(reset)|(stop) in house$/i)) {
      moveMembersToLobby(guild, constants.channelIds.RADIANT);
      moveMembersToLobby(guild, constants.channelIds.DIRE);
    }
  },
});

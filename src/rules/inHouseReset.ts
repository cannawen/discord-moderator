import constants from "../constants";
import { findVoiceChannel } from "../helpers";
import { Guild } from "discord.js";
import Rule from "../Rule";

function moveMembersToLobby(guild: Guild, fromChannelId: string) {
  findVoiceChannel(fromChannelId).members.forEach((m) =>
    m.voice.setChannel(findVoiceChannel(constants.channelIds.LOBBY))
  );
}

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (guild, utterance) => {
    if (utterance.match(/^(reset|stop) in house$/i)) {
      moveMembersToLobby(guild, constants.channelIds.RADIANT);
      moveMembersToLobby(guild, constants.channelIds.DIRE);
    }
  },
});

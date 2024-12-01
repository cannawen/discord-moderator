import { findVoiceChannel, moveToVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

function moveMembersToLobby(fromChannelId: string) {
  moveToVoiceChannel(
    findVoiceChannel(fromChannelId).members,
    constants.discord.channelIds.LOBBY
  );
}

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (utterance) => {
    if (
      utterance.match(/^(reset|stop) in house$/i) ||
      utterance.match(/^take (us|me) to lobby$/i)
    ) {
      winston.info("Move - Radiant and Dire to Lobby");
      moveMembersToLobby(constants.discord.channelIds.RADIANT);
      moveMembersToLobby(constants.discord.channelIds.DIRE);
    }
  },
});

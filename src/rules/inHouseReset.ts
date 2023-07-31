import { findVoiceChannel, moveToVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

function moveMembersToLobby(fromChannelId: string) {
  moveToVoiceChannel(
    findVoiceChannel(fromChannelId).members,
    constants.channelIds.LOBBY
  );
}

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (utterance) => {
    if (
      utterance.match(/^(reset|stop) in house$/i) ||
      utterance.match(/^take (us|me) to lobby$/i)
    ) {
      moveMembersToLobby(constants.channelIds.RADIANT);
      moveMembersToLobby(constants.channelIds.DIRE);
    }
  },
});

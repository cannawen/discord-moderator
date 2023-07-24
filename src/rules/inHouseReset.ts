import constants from "../constants";
import { findVoiceChannel } from "../helpers";
import Rule from "../Rule";

function moveMembersToLobby(fromChannelId: string) {
  findVoiceChannel(fromChannelId).members.forEach((m) =>
    m.voice.setChannel(findVoiceChannel(constants.channelIds.LOBBY))
  );
}

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (utterance) => {
    if (utterance.match(/^(reset|stop) in house$/i)) {
      moveMembersToLobby(constants.channelIds.RADIANT);
      moveMembersToLobby(constants.channelIds.DIRE);
    }
  },
});

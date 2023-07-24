import { findVoiceChannel, moveMemberToVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

function foundRicoInChannel(channelId: string): boolean {
  return (
    findVoiceChannel(channelId).members.find(
      (m) => m.id === constants.memberIds.RICO
    ) !== undefined
  );
}

function ifRicoFoundMoveEveryoneToChurch(channelId: string) {
  if (foundRicoInChannel(channelId)) {
    moveMemberToVoiceChannel(
      constants.memberIds.RICO,
      constants.channelIds.THE_CHURCH_OF_RICO
    );
    findVoiceChannel(channelId).members.forEach((m) =>
      moveMemberToVoiceChannel(m, constants.channelIds.THE_CHURCH_OF_RICO)
    );
  }
}

export default new Rule({
  description:
    "when Rico joins the Dota 2 or General channel, move him and everyone in that channel to The Church of Rico",
  tick: () => {
    ifRicoFoundMoveEveryoneToChurch(constants.channelIds.DOTA_2);
    ifRicoFoundMoveEveryoneToChurch(constants.channelIds.GENERAL);
  },
});

import {
  findMember,
  findVoiceChannel,
  moveMemberToVoiceChannel,
} from "../helpers";
import constants from "../constants";
import { Guild } from "discord.js";
import Rule from "../Rule";

function foundRicoInChannel(guild: Guild, channelId: string): boolean {
  return (
    findVoiceChannel(channelId).members.find(
      (m) => m.id === constants.memberIds.RICO
    ) !== undefined
  );
}

function ifRicoFoundMoveEveryoneToChurch(guild: Guild, channelId: string) {
  if (foundRicoInChannel(guild, channelId)) {
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
  tick: (guild) => {
    ifRicoFoundMoveEveryoneToChurch(guild, constants.channelIds.DOTA_2);
    ifRicoFoundMoveEveryoneToChurch(guild, constants.channelIds.GENERAL);
  },
});

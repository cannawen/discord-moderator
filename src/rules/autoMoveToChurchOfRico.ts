import { Guild, VoiceChannel } from "discord.js";
import constants from "../constants";
import Rule from "../Rule";

function findVoiceChannel(guild: Guild, channelId: string): VoiceChannel {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

function foundRicoInChannel(guild: Guild, channelId: string): boolean {
  return (
    findVoiceChannel(guild, channelId).members.find(
      (m) => m.id === constants.memberIds.RICO
    ) !== undefined
  );
}

function moveAllMembersToChurch(guild: Guild, fromChannelId: string): void {
  const fromChannel = findVoiceChannel(guild, fromChannelId);
  const toChannel = findVoiceChannel(
    guild,
    constants.channelIds.THE_CHURCH_OF_RICO
  );

  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

function moveRicoToChurch(guild: Guild) {
  guild.members.cache
    .find((u) => u.id === constants.memberIds.RICO)
    ?.voice.setChannel(
      findVoiceChannel(guild, constants.channelIds.THE_CHURCH_OF_RICO)
    );
}

function ifRicoFoundMoveEveryoneToChurch(guild: Guild, channelId: string) {
  if (foundRicoInChannel(guild, channelId)) {
    moveRicoToChurch(guild);
    moveAllMembersToChurch(guild, channelId);
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

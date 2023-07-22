import { Guild, VoiceChannel } from "discord.js";
import constants from "../constants";
import cron from "node-cron";
import Rule from "../Rule";

function findVoiceChannel(guild: Guild, channelId: string): VoiceChannel {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

function foundRicoInChannel(guild: Guild, channelId: string): boolean {
  return (
    findVoiceChannel(guild, channelId).members.find(
      (m) => m.id === constants.userIds.RICO
    ) !== undefined
  );
}

function moveAllUsersToChurch(guild: Guild, fromChannelId: string): void {
  const fromChannel = findVoiceChannel(guild, fromChannelId);
  const toChannel = findVoiceChannel(
    guild,
    constants.channelIds.THE_CHURCH_OF_RICO
  );

  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

function moveRicoToChurch(guild: Guild) {
  guild.members.cache
    .find((u) => u.id === constants.userIds.RICO)
    ?.voice.setChannel(
      findVoiceChannel(guild, constants.channelIds.THE_CHURCH_OF_RICO)
    );
}

function findRicoAndMoveEveryoneToChurch(guild: Guild, channelId: string) {
  if (foundRicoInChannel(guild, channelId)) {
    moveRicoToChurch(guild);
    moveAllUsersToChurch(guild, channelId);
  }
}

export default new Rule({
  description:
    "when Rico joins the Dota 2 or General channel, move him and everyone in that channel to The Church of Rico",
  registerGuild: (guild) => {
    cron.schedule("*/1 * * * * *", () => {
      findRicoAndMoveEveryoneToChurch(guild, constants.channelIds.DOTA_2);
      findRicoAndMoveEveryoneToChurch(guild, constants.channelIds.GENERAL);
    });
  },
});

import { Guild, VoiceChannel } from "discord.js";
import cron from "node-cron";
import Rule from "../Rule";

function findVoiceChannel(guild: Guild, channelId: string): VoiceChannel {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

function foundUserInChannel(userId: string, channel: VoiceChannel): boolean {
  return channel.members.find((m) => m.id === userId) !== undefined;
}

function moveAllUsers(
  fromChannel: VoiceChannel,
  toChannel: VoiceChannel
): void {
  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

export default new Rule(
  "when Rico joins the Dota 2 or General channel, move him and everyone in that channel to The Church of Rico",
  (guild) => {
    const churchOfRico = findVoiceChannel(
      guild,
      process.env.CHANNEL_ID_CHURCH_OF_RICO!
    );
    const dota2 = findVoiceChannel(guild, process.env.CHANNEL_ID_DOTA_2!);
    const general = findVoiceChannel(guild, process.env.CHANNEL_ID_GENERAL!);

    cron.schedule("*/2 * * * * *", () => {
      if (foundUserInChannel(process.env.USER_ID_RICO!, dota2)) {
        moveAllUsers(dota2, churchOfRico);
      } else if (foundUserInChannel(process.env.USER_ID_RICO!, general)) {
        moveAllUsers(general, churchOfRico);
      }
    });
  }
);

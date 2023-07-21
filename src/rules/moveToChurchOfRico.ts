import { Guild, VoiceChannel } from "discord.js";
import cron from "node-cron";
import Rule from "../Rule";

let churchOfRico: VoiceChannel;
let dota2: VoiceChannel;
let general: VoiceChannel;

function findVoiceChannel(guild: Guild, channelId: string) {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

function foundRicoInChannel(channel: VoiceChannel) {
  return (
    channel.members.find((m) => m.id === process.env.USER_ID_RICO) !== undefined
  );
}

function moveAllUsers(fromChannel: VoiceChannel, toChannel: VoiceChannel) {
  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

cron.schedule("*/2 * * * * *", () => {
  if (foundRicoInChannel(dota2)) {
    moveAllUsers(dota2, churchOfRico);
  } else if (foundRicoInChannel(general)) {
    moveAllUsers(general, churchOfRico);
  }
});

export default new Rule((guild) => {
  churchOfRico = findVoiceChannel(
    guild,
    process.env.CHANNEL_ID_CHURCH_OF_RICO!
  );
  dota2 = findVoiceChannel(guild, process.env.CHANNEL_ID_DOTA_2!);
  general = findVoiceChannel(guild, process.env.CHANNEL_ID_GENERAL!);
});

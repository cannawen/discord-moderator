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
    channel.members.find((m) => m.id === "212986339212263434") !== undefined
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
  churchOfRico = findVoiceChannel(guild, "1113512037780303995");
  dota2 = findVoiceChannel(guild, "798885243322499073");
  general = findVoiceChannel(guild, "773552279265083412");
  console.log("found church channel", churchOfRico);
});

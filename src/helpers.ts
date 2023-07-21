import { Guild, VoiceChannel } from "discord.js";

export function findVoiceChannel(
  guild: Guild,
  channelId: string
): VoiceChannel {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

export function foundUserInChannel(
  userId: string,
  channel: VoiceChannel
): boolean {
  return channel.members.find((m) => m.id === userId) !== undefined;
}

export function moveAllUsers(
  fromChannel: VoiceChannel,
  toChannel: VoiceChannel
): void {
  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

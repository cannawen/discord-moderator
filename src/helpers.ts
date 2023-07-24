import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  PlayerSubscription,
} from "@discordjs/voice";
import { Guild, GuildMember, Role, VoiceChannel } from "discord.js";
import client from "./discordClient";
import constants from "./constants";
import path from "path";

let subscription: PlayerSubscription | undefined;

export function playAudio(fileName: string) {
  const connection = getVoiceConnection(constants.guildIds.BEST_DOTA)!;
  const player = createAudioPlayer();

  subscription = connection.subscribe(player);
  subscription?.player.play(
    createAudioResource(path.join(__dirname, "../audio", fileName))
  );
}

export function stopAudio() {
  subscription?.player.stop();
}

export function findGuild() {
  return client.guilds.cache.find(
    (g) => g.id === constants.guildIds.BEST_DOTA
  ) as Guild;
}

export function findMember(memberId: string) {
  return findGuild().members.cache.find(
    (m) => m.id === memberId
  ) as GuildMember;
}

export function findVoiceChannel(channelId: string) {
  return findGuild().channels.cache.find(
    (c) => c.id === channelId
  ) as VoiceChannel;
}

export function moveMemberToVoiceChannel(
  member: string | GuildMember,
  channelId: string
) {
  if (typeof member === "string") {
    findMember(member).voice.setChannel(findVoiceChannel(channelId));
  }
  if (member instanceof GuildMember) {
    member.voice.setChannel(findVoiceChannel(channelId));
  }
}

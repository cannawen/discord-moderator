import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  PlayerSubscription,
} from "@discordjs/voice";
import {
  Collection,
  Guild,
  GuildMember,
  Role,
  TextChannel,
  VoiceChannel,
} from "discord.js";
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

function findChannel(channelId: string) {
  return findGuild().channels.cache.find((c) => c.id === channelId);
}

export function findTextChannel(channelId: string) {
  return findChannel(channelId) as TextChannel;
}

export function findVoiceChannel(channelId: string) {
  return findChannel(channelId) as VoiceChannel;
}

export function fetchMessage(channelId: string, messageId: string) {
  return (findChannel(channelId) as TextChannel).messages.fetch(messageId);
}

export function moveToVoiceChannel(
  member: string | GuildMember | Collection<string, GuildMember>,
  channelId: string
) {
  let members: GuildMember[] = [];

  if (typeof member === "string") {
    members = [findMember(member)];
  } else if (member instanceof GuildMember) {
    members = [member];
  } else {
    members = [...member.values()];
  }

  members.forEach((m) => m.voice.setChannel(findVoiceChannel(channelId)));
}

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
  TextChannel,
  VoiceChannel,
} from "discord.js";
import client from "./discordClient";
import constants from "./constants";
import fs from "fs";
import path from "path";
import tts from "./textToSpeech";
import winston = require("winston");

let subscription: PlayerSubscription | undefined;
let audioEnabled = true;

export function enableAudio() {
  winston.info(`Audio - Enabled`);
  audioEnabled = true;
}

export function disableAudioForAnHour() {
  winston.info(`Audio - Disabled for an hour`);
  audioEnabled = false;
  setTimeout(() => {
    enableAudio();
  }, 60 * 60 * 1000);
}

export function playAudio(input: string, msDelay: number = 0) {
  if (!audioEnabled) return;

  setTimeout(() => {
    const connection = getVoiceConnection(constants.guildIds.BEST_DOTA);
    if (!connection) {
      winston.warn(`no voice connection; cannot play file ${input}`);
      return;
    }
    const player = createAudioPlayer();
    subscription = connection.subscribe(player);

    const audioFile = path.join(__dirname, "../audio", input);
    const ttsFile = path.join(__dirname, "..", tts.path(input));

    if (fs.existsSync(audioFile)) {
      winston.info(`Audio - ${input}`);
      subscription?.player.play(createAudioResource(audioFile));
    } else if (fs.existsSync(ttsFile)) {
      winston.info(`Audio - TTS - "${input}"`);
      const audioResource = createAudioResource(ttsFile);
      console.log("ttsFile", ttsFile);
      console.log("subscription", subscription);
      console.log("player", subscription?.player);
      console.log("audio resource", audioResource);
      subscription?.player.play(audioResource);
    } else {
      tts
        .create(input)
        .then(() => {
          playAudio(input);
        })
        .catch(() => playAudio("error.mp3"));
    }
  }, msDelay);
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

export function findMemberVoiceChannelId(memberId: string) {
  return findMember(memberId).voice.channelId;
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

export function filterBots(members: Collection<string, GuildMember>) {
  return members.filter(
    (member) =>
      member.id !== constants.memberIds.CANNA_BOT &&
      member.id !== constants.memberIds.DOTA_COACH
  );
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

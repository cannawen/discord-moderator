import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
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
import { rules } from "./ruleManager";
import tts from "./textToSpeech";
import winston = require("winston");

let player: AudioPlayer | undefined;
let audioEnabled = true;

export function enableAudio() {
  winston.info(`Audio - Enabled`);
  audioEnabled = true;
}

export function disableAudioForAnHour() {
  winston.info(`Audio - Disabled for an hour`);
  audioEnabled = false;
  stopAudio();

  setTimeout(() => {
    enableAudio();
  }, 60 * 60 * 1000);
}

export function playAudio(input: string, msDelay: number = 0) {
  if (!audioEnabled) return;

  setTimeout(() => {
    const connection = getVoiceConnection(constants.discord.guildIds.BEST_DOTA);
    if (!connection) {
      winston.warn(`no voice connection; cannot play file ${input}`);
      return;
    }
    player = createAudioPlayer();
    connection.subscribe(player);

    const audioFile = path.join(__dirname, "../audio", input);
    const ttsFile = path.join(__dirname, "..", tts.path(input));

    if (fs.existsSync(audioFile)) {
      winston.info(`Audio - ${input}`);
      player.play(createAudioResource(audioFile));
    } else if (fs.existsSync(ttsFile)) {
      winston.info(`Audio - TTS - "${input}"`);
      player.play(createAudioResource(ttsFile));
    } else {
      tts
        .create(input)
        .then(() => {
          playAudio(input);
        })
        .catch((e) => {
          winston.error(`Audio - TTS - "${input}"`);
          winston.error(e);
          playAudio("error.mp3");
        });
    }
  }, msDelay);
}

export function stopAudio() {
  player?.stop();
}

export function findGuild() {
  return client.guilds.cache.find(
    (g) => g.id === constants.discord.guildIds.BEST_DOTA
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
      member.id !== constants.discord.memberIds.CANNA_BOT &&
      member.id !== constants.discord.memberIds.DOTA_COACH &&
      member.id !== constants.discord.memberIds.DOTA_COACH_NEW
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

  try {
    members
      // canna-bot will move itself, so do not touch it when moving
      .filter((m) => m.id !== constants.discord.memberIds.CANNA_BOT)
      .forEach((m) => m.voice.setChannel(findVoiceChannel(channelId)));
  } catch (error) {
    winston.error(`Unable to move members to ${channelId}`);
  }
}

export function voiceCommand(command: string) {
  rules.forEach((r) => {
    if (r.utterance) {
      r.utterance(command, constants.discord.memberIds.CANNA_BOT);
    }
  });
}

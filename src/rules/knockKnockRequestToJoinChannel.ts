import {
  findMember,
  findMemberVoiceChannelId,
  findVoiceChannel,
  moveToVoiceChannel,
  playAudio,
} from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import winston from "winston";

function isProtectedChannel(channelId: string | undefined | null) {
  return (
    channelId === constants.discord.channelIds.FOCUS ||
    channelId === constants.discord.channelIds.HIDING
  );
}

let memberRequestingToJoin: string | undefined;
let knockingEnabled = true;

export default [
  new Rule({
    description:
      "knocks when someone enters non-protected channel when the bot is in a protected channel",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        // if knocking is not enabled (due to mass migration), do nothing
        if (!knockingEnabled) return;
        // if a user is leaving a voice channel, do nothing
        if (!newVoiceState.channelId) return;
        // if user is a bot, do nothing
        if (newVoiceState.member?.user.bot) return;

        const botChannel = findMemberVoiceChannelId(
          constants.discord.memberIds.CANNA_BOT
        );
        // if the bot is in a protected channel 
        // and a user joins a non-protected channel
        // and user has moved channels
        if (
          isProtectedChannel(botChannel) &&
          !isProtectedChannel(newVoiceState.channelId) &&
          newVoiceState.channelId !== oldVoiceState.channelId
        ) {
          // knock
          const displayName = newVoiceState.member?.displayName!;
          winston.info(
            `Move - ${displayName} requesting to join ${findVoiceChannel(botChannel!).name
            }`
          );

          memberRequestingToJoin = newVoiceState.member?.id;

          setTimeout(() => {
            if (memberRequestingToJoin) {
              winston.info(`Move - ${displayName} request timed out`);
              memberRequestingToJoin = undefined;
            }
          }, 60 * 1000);

          playAudio("knock.mp3");
          playAudio(displayName, 500);
        }
      });
    },
  }),

  new Rule({
    description: "allow someone to enter the protected channel (or not)",
    utterance: (utterance, memberId) => {
      if (!memberRequestingToJoin) return;

      const speaker = findMember(memberId).displayName;
      const requester = findMember(memberRequestingToJoin).displayName;

      if (utterance.match(/^(come in|enter|allow|yes|accept)$/i)) {
        winston.info(`Move - ${requester} approved (${speaker})`);
        const botChannel = findMemberVoiceChannelId(
          constants.discord.memberIds.CANNA_BOT
        )!;
        moveToVoiceChannel(memberRequestingToJoin, botChannel);
        memberRequestingToJoin = undefined;
      }

      if (utterance.match(/^(no thank you|no thanks|disallow|no)$/i)) {
        winston.info(`Move - ${requester} rejected (${speaker})`);
        memberRequestingToJoin = undefined;
        playAudio("success.mp3");
      }
    },
  }),

  new Rule({
    description: "disable knocking on mass migration",
    utterance: (utterance) => {
      if (utterance.match(/^take .{2,10} to .{1,20}$/i)) {
        knockingEnabled = false;
        setTimeout(() => {
          knockingEnabled = true;
        }, 5 * 1000);
      }
    },
  }),
];

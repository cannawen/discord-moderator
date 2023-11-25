import {
  findMember,
  findMemberVoiceChannelId,
  moveToVoiceChannel,
  playAudio,
} from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import winston from "winston";

function isSecretChannel(channelId: string | undefined | null) {
  return (
    channelId === constants.channelIds.SECRETS ||
    channelId === constants.channelIds.REAL_SECRETS
  );
}

let memberRequestingToJoin: string | undefined;
let knockingEnabled = true;

export default [
  new Rule({
    description:
      "knocks when someone enters a non-secret channel when the bot is in secrets",
    start: () => {
      client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
        // if knocking is not enabled (due to mass migration), do nothing
        if (!knockingEnabled) return;
        // if a user is leaving a voice channel, do nothing
        if (!newVoiceState.channelId) return;
        // if user was already in a channel, do nothing
        if (oldVoiceState.channelId) return;

        // if the bot is in a secret channel and a user joins a non-secret channel, knock
        if (
          isSecretChannel(
            findMemberVoiceChannelId(constants.memberIds.CANNA_BOT)
          ) &&
          !isSecretChannel(newVoiceState.channelId)
        ) {
          const displayName = newVoiceState.member?.displayName!;
          winston.info(`Move - ${displayName} requesting to join secrets`);

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
    description: "allow someone to enter the secret channel (or not)",
    utterance: (utterance, memberId) => {
      if (!memberRequestingToJoin) return;

      const speaker = findMember(memberId).displayName;
      const requester = findMember(memberRequestingToJoin).displayName;

      if (utterance.match(/^(come in|enter|allow)$/i)) {
        winston.info(`Move - ${requester} approved (${speaker})`);
        const botChannel = findMemberVoiceChannelId(
          constants.memberIds.CANNA_BOT
        )!;
        moveToVoiceChannel(memberRequestingToJoin, botChannel);
        memberRequestingToJoin = undefined;
      }

      if (utterance.match(/^(no thank you|no thanks|disallow)$/i)) {
        winston.info(`Move - ${requester} rejected (${speaker})`);
        memberRequestingToJoin = undefined;
      }
    },
  }),

  new Rule({
    description: "disable knocking on mass migration",
    utterance: (utterance) => {
      if (utterance.match(/^take .{2,10} to .*$/i)) {
        knockingEnabled = false;
        setTimeout(() => {
          knockingEnabled = true;
        }, 5 * 1000);
      }
    },
  }),
];

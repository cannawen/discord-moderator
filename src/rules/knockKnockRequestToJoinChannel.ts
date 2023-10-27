import {
  findMember,
  findMemberChannelId,
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
      client.on(Events.VoiceStateUpdate, (_, newVoiceState) => {
        if (
          knockingEnabled &&
          isSecretChannel(findMemberChannelId(constants.memberIds.CANNA_BOT)) &&
          newVoiceState.channelId &&
          !isSecretChannel(newVoiceState.channelId)
        ) {
          const displayName = newVoiceState.member?.displayName;

          winston.info(`Move - ${displayName} requesting to join secrets`);

          memberRequestingToJoin = newVoiceState.member?.id;
          setTimeout(() => {
            memberRequestingToJoin = undefined;
          }, 60 * 1000);

          playAudio("knock.mp3");

          if (displayName) {
            setTimeout(() => {
              playAudio(displayName);
            }, 500);
          }
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

      if (utterance.match(/^who.* there$/i)) {
        playAudio(requester);
      }

      if (utterance.match(/^(come in|enter|allow)$/i)) {
        winston.info(`Move - ${requester} approved (${speaker})`);
        const botChannel = findMemberChannelId(constants.memberIds.CANNA_BOT)!;
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
      if (utterance.match(/^take (me|us) to .*$/i)) {
        knockingEnabled = false;
        setTimeout(() => {
          knockingEnabled = true;
        }, 5 * 1000);
      }
    },
  }),
];

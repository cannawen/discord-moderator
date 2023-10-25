import { findMember, moveToVoiceChannel, playAudio } from "../helpers";
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

export default [
  new Rule({
    description:
      "knocks when someone enters a non-secret channel when the bot is in secrets",
    start: () => {
      client.on(Events.VoiceStateUpdate, (_, newVoiceState) => {
        const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
          .channel?.id;
        if (
          isSecretChannel(botChannel) &&
          !isSecretChannel(newVoiceState.channelId)
        ) {
          const displayName = newVoiceState.member?.displayName;

          winston.info(`Move - ${displayName} requesting to join secrets`);

          memberRequestingToJoin = newVoiceState.member?.id;
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

      if (utterance.match(/^(come in|enter)$/i)) {
        winston.info(`Move - ${requester} approved (${speaker})`);
        const botChannel = findMember(constants.memberIds.CANNA_BOT).voice
          .channel?.id!;
        moveToVoiceChannel(memberRequestingToJoin, botChannel);

        memberRequestingToJoin = undefined;
      } else if (utterance.match(/^(no thank you|no thanks)$/i)) {
        winston.info(`Move - ${requester} rejected (${speaker})`);
        memberRequestingToJoin = undefined;
      }
    },
  }),
];

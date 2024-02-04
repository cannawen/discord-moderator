import { filterBots, findVoiceChannel, playAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

let timers: Array<ReturnType<typeof setTimeout>> = [];

export default [
  new Rule({
    description:
      "dota 2 x among us mode: assign imposters and inform teams who their secret agents are",
    utterance: (utterance) => {
      if (utterance.match(/^(there is|there's) an imposter among us$/i)) {
        const direMembers = filterBots(
          findVoiceChannel(constants.channelIds.DIRE).members
        );
        const radiantMembers = filterBots(
          findVoiceChannel(constants.channelIds.RADIANT).members
        );

        const direImposter = direMembers.random();
        const radiantImposter = radiantMembers.random();

        const imposterMessage =
          "YOU ARE THE IMPOSTER! You win if your team loses, and you are not caught. You may not press the cancel button if your team wants to gg out";
        direImposter?.send(imposterMessage);
        radiantImposter?.send(imposterMessage);

        const regularMessage = `You are NOT the imposter. Play this game trying to win, but look out for sus activity from your teammates because there is an imposter among us`;
        direMembers
          .filter((m) => m.id !== direImposter?.id)
          .map((m) => m.send(regularMessage));
        radiantMembers
          .filter((m) => m.id !== radiantImposter?.id)
          .map((m) => m.send(regularMessage));

        winston.info(
          `In house - Among us. Radiant imposter: ||${radiantImposter?.displayName}||. Dire imposter: ||${direImposter?.displayName}||`
        );
      }
    },
  }),
  new Rule({
    description: "start discussion timer",
    utterance: (utterance) => {
      if (utterance.match(/^start discussion timer?$/i)) {
        playAudio("10 minutes remaining");
        timers = [
          setTimeout(() => {
            playAudio("5 minutes remaining");
          }, 5 * 60 * 1000),
          setTimeout(() => playAudio("1 minute remaining"), 9 * 60 * 1000),
          setTimeout(() => {
            playAudio("time's up");
            timers = [];
          }, 10 * 60 * 1000),
        ];
      }
    },
  }),
  new Rule({
    description: "cancel discussion timers",
    utterance: (utterance) => {
      if (utterance.match(/^(cancel|stop)( discussion timer?)?$/i)) {
        timers.forEach(clearTimeout);
        playAudio("success.mp3");
        timers = [];
      }
    },
  }),
];

import { findVoiceChannel, moveToVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "move Radiant and Dire members to Lobby",
  utterance: (utterance) => {
    if (utterance.match(/^there is an imposter among us$/i)) {
      const direMembers = findVoiceChannel(constants.channelIds.DIRE).members;
      const radiantMembers = findVoiceChannel(
        constants.channelIds.RADIANT
      ).members;

      const direImposter = direMembers.random();
      const radiantImposter = radiantMembers.random();

      direImposter?.send("YOU ARE THE IMPOSTER! You work for Team Radiant.");
      radiantImposter?.send("YOU ARE THE IMPOSTER! You work for Team Dire.");

      direMembers
        .filter((m) => m.id !== direImposter?.id)
        .map((m) =>
          m.send(`Your secret agent is: ${radiantImposter?.nickname}`)
        );
      radiantMembers
        .filter((m) => m.id !== radiantImposter?.id)
        .map((m) => m.send(`Your secret agent is: ${direImposter?.nickname}`));

      winston.info(
        `In house - Among us. Radiant imposter: ||${radiantImposter?.nickname}||. Dire imposter: ||${direImposter?.nickname}||`
      );
    }
  },
});

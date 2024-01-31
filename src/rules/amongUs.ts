import { filterBots, findVoiceChannel } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
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
        "YOU ARE THE IMPOSTER! You are trying to lose this game without letting your teammates get suspicious. You may not cancel if your teammates want to gg out";
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
});

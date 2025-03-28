import constants from "../../constants";
import { findMember, voiceCommand } from "../../helpers";
import https from "https";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
  description:
    'disconnects user on "see you later nerds" and stops coaching when Canna says it',
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^see you later nerd?s?$/i) ||
      utterance.match(/^disconnect$/i)
    ) {
      winston.info(
        `Disconnect - ${findMember(memberId).displayName} (${utterance})`
      );
      findMember(memberId).voice.disconnect();

      if (memberId === constants.discord.memberIds.CANNA) {
        voiceCommand("end stream")

        https
          .request({
            method: "POST",
            hostname: constants.dotaCoach.DOMAIN,
            path: `/coach/${constants.dotaCoach.CANNA_STUDENT_ID}/stop`,
          })
          .end();
      }
    }
  },
});

import constants from "../../constants";
import { findMember, voiceCommand } from "../../helpers";
import http from "http";
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
      findMember(memberId).voice.disconnect(utterance);

      if (memberId === constants.discord.memberIds.CANNA) {
        http
        .request({
          method: "POST",
          hostname: constants.dotaCoach.DOMAIN,
          path: `/coach/${constants.dotaCoach.CANNA_STUDENT_ID}/stop`,
          port: 8080,
        })
        .end();

        voiceCommand("end stream quietly")
      }
    }
  },
});

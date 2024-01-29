import { findMember, voiceCommand } from "../../helpers";
import constants from "../../constants";
import https from "https";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
  description:
    'disconnects user on "see you later nerds" and stops coaching when Canna says it',
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^see you later nerds?$/i) ||
      utterance.match(/^disconnect$/i)
    ) {
      winston.info(
        `Disconnect - ${findMember(memberId).displayName} (${utterance})`
      );
      findMember(memberId).voice.disconnect();

      if (memberId === constants.memberIds.CANNA) {
        voiceCommand("stop streaming");

        https
          .request({
            method: "POST",
            hostname: "dota-coach.fly.dev",
            path: `/coach/${constants.studentIds.CANNA}/stop`,
          })
          .end();
      }
    }
  },
});

import constants from "../../constants";
import { findMember } from "../../helpers";
import https from "https";
import obsClient from "../../obsClient";
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

      if (memberId === constants.memberIds.CANNA) {
        obsClient.streamCannaStop().catch(() => {});

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

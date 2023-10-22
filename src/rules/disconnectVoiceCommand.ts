import constants from "../constants";
import { findMember } from "../helpers";
import https from "https";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description:
    'disconnects user on "see you later nerds" and stops coaching when Canna says it',
  utterance: (utterance, memberId) => {
    if (
      utterance.match(/^see you later.{0,10}$/i) ||
      utterance.match(/^disconnect$/i)
    ) {
      winston.info(
        `Disconnect - ${findMember(memberId).displayName} (${utterance})`
      );
      findMember(memberId).voice.disconnect();

      if (memberId === constants.memberIds.CANNA) {
        https
          .request({
            method: "POST",
            hostname: "dota-coach.fly.dev",
            path: "/coach/20d594ff682d61c52ed003bad86a05aa708d454fafb0115a3248a8f5c5a7b833/stop",
          })
          .end();
      }
    }
  },
});

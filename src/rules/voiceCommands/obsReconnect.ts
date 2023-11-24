import constants from "../../constants";
import obsClient from "../../obsClient";
import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
  description:
    "Reconnect voice command triggers bot to re-initialize obs client",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^reconnect$/i)) {
      if (memberId === constants.memberIds.CANNA) {
        winston.info("OBS - Canna - processing Reconnect");
        obsClient
          .connectCanna()
          .then(() => playAudio("success.mp3"))
          .catch(() => playAudio("error.mp3"));
      }
    }
  },
});

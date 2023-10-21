import Rule from "../Rule";
import constants from "../constants";
import { playAudio } from "../helpers";
import obsClient from "../obsClient";

export default new Rule({
  description:
    "Reconnect voice command triggers bot to re-initialize obs client",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^reconnect$/i)) {
      if (memberId === constants.memberIds.CANNA) {
        obsClient
          .connectCanna()
          .then(() => playAudio("success.mp3"))
          .catch(() => playAudio("error.mp3"));
      }
      if (memberId === constants.memberIds.TEAZY) {
        obsClient
          .connectTeazy()
          .then(() => playAudio("success.mp3"))
          .catch(() => playAudio("error.mp3"));
      }
    }
  },
});

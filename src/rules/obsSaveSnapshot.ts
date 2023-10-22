import constants from "../constants";
import { findMember, playAudio } from "../helpers";
import Rule from "../Rule";
import obsClient from "../obsClient";

export default new Rule({
  description: "when someone says 'snapshot' record OBS stream",
  utterance: (utterance) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      playAudio("photo.mp3");

      setTimeout(() => {
        if (findMember(constants.memberIds.CANNA).voice.channel) {
          obsClient
            .clipCanna()
            .catch(() => playAudio("error saving Canna clip"));
        }
        if (findMember(constants.memberIds.CANNA).voice.channel) {
          obsClient
            .clipTeazy()
            .catch(() => playAudio("error saving Teazy clip"));
        }
      }, 5 * 1000);
    }
  },
});

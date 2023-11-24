import { findMember, playAudio } from "../../helpers";
import obsClient from "../../obsClient";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
  description: "when someone says 'snapshot', record Canna clip",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      winston.info(
        `OBS - triggering snapshot (${findMember(memberId).displayName})`
      );

      obsClient
        .reidentifyCanna()
        .then(() => {
          playAudio("photo.mp3");

          setTimeout(() => {
            obsClient
              .clipCanna()
              .catch(() => playAudio("error saving Canna clip"));
          }, 10 * 1000);
        })
        .catch(() => playAudio("Canna OBS not connected"));
    }
  },
});

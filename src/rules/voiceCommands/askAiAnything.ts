import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

let questioningMember: string | undefined;

export default new Rule({
  description: "listen for keyword",
  utterance: (utterance, memberId) => {
    if (
      !questioningMember &&
      utterance.match(/^(okay|ok) (bot|but|bought)$/i)
    ) {
      questioningMember = memberId;
      playAudio("success.mp3");
      return;
    }

    if (questioningMember === memberId) {
      winston.info(`Question - ${utterance}`);
      questioningMember = undefined;
      return;
    }
  },
});

import OpenAi from "openai";
import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";
import constants from "../../constants";

let questioningMember: string | undefined;

const openai = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

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
      openai.chat.completions
        .create({
          messages: [{ role: "user", content: utterance }],
          model: "gpt-3.5-turbo",
        })
        .then((completion) => {
          const answer = completion.choices[0].message.content;
          winston.info(`Answer - ${answer}`);
          playAudio(answer ? answer : "error.mp3");
        })
        .catch((e) => {
          playAudio("error.mp3");
          winston.error("Unable to answer question");
          winston.error(e);
        });
      questioningMember = undefined;
      return;
    }
  },
});

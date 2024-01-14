import OpenAi from "openai";
import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";
import constants from "../../constants";

let questioningMember: string | undefined;
let dadJoke: boolean = false;

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

function handleQuestion(question: string) {
  if (question.length < 10) return;
  winston.info(`Question - ${question}${dadJoke ? " (dad joke)" : ""}`);
  openAi.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content: dadJoke
            ? "You are a funny assistant who answers questions in one short sentence. Respond with puns when possible."
            : "You are a helpful assistant who answers questions in one short sentence.",
        },
        { role: "user", content: question },
      ],
      model: "gpt-3.5-turbo",
    })
    .then((completion) => {
      const answer = completion.choices[0].message.content;
      playAudio(answer ? answer : "error.mp3");
    })
    .catch((e) => {
      playAudio("error.mp3");
      winston.error("Unable to answer question");
      winston.error(e);
    });
}

export default new Rule({
  description: "listen for question and responds with answer",
  utterance: (utterance, memberId) => {
    const triggerMatch = utterance.match(
      /^(okay|ok|hey|hay) (bot|but|bought|dad)(.+)?$/i
    );

    if (triggerMatch) {
      dadJoke = triggerMatch[2].match(/dad/i) !== null;
      if (triggerMatch[3]) {
        handleQuestion(triggerMatch[3]);
      } else {
        // limitation:
        // if two people say `OK Bot` one right after the other
        // the bot will only answer the second person
        questioningMember = memberId;
        playAudio("success.mp3");
      }
      return;
    }

    // ideally this would be two rules so we don't need the early return
    // but there is no guarentee what order the rules will be run in
    // and it would be bad to have some weird race conditions since we
    // are using a global variable to convey information (kinda sus)
    if (questioningMember === memberId) {
      handleQuestion(utterance);
      questioningMember = undefined;
      return;
    }

    if (utterance.match(/^(stop|cancel)$/i)) {
      questioningMember = undefined;
      return;
    }
  },
});

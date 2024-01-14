import OpenAi from "openai";
import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";
import constants from "../../constants";

enum BotPersonality {
  DadJoke,
  Helpful,
}

const BotPersonalityToBotSystemInstruction = new Map<BotPersonality, string>([
  [
    BotPersonality.DadJoke,
    "You are a funny assistant who answers questions in one short sentence. Respond with puns when possible.",
  ],
  [
    BotPersonality.Helpful,
    "You are a helpful assistant who answers questions in one short sentence.",
  ],
]);

let state: { [key: string]: BotPersonality } = {};

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

function handleQuestion(question: string, memberId: string) {
  if (question.length < 10) return;
  winston.info(
    `Question - ${question}${
      state[memberId] === BotPersonality.DadJoke ? " (dad joke)" : ""
    }`
  );
  openAi.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content:
            BotPersonalityToBotSystemInstruction.get(state[memberId]) || "",
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
  delete state[memberId];
}

export default [
  new Rule({
    description: "listen for question and responds with answer",
    utterance: (utterance, memberId) => {
      if (memberId in state) {
        handleQuestion(utterance, memberId);
      } else {
        const triggerMatch = utterance.match(
          /^(okay|ok|hey|hay) (?<personality>bot|but|bought|dad)(?<question>.+)?$/i
        );

        if (triggerMatch) {
          const dadJoke =
            triggerMatch.groups?.personality.match(/dad/i) !== null;
          state[memberId] = dadJoke
            ? BotPersonality.DadJoke
            : BotPersonality.Helpful;

          if (triggerMatch.groups?.question) {
            handleQuestion(triggerMatch.groups.question, memberId);
          } else {
            playAudio("success.mp3");
          }
        }
      }
    },
  }),
  new Rule({
    description: "cancel asking question",
    utterance: (utterance, memberId) => {
      if (utterance.match(/^(stop|cancel)$/i)) {
        delete state[memberId];
      }
    },
  }),
];

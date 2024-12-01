import { findMember, findTextChannel, playAudio } from "../../helpers";
import constants from "../../constants";
import OpenAi from "openai";
import Rule from "../../Rule";
import winston from "winston";

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

class Personality {
  systemInstruction: string;
  regexKeyword: string;
  regex: RegExp;
  postAnswerToBotsChannel: boolean;

  constructor(
    systemInstruction: string,
    regexKeyword: string,
    postAnswerToBotsChannel: boolean = false
  ) {
    this.systemInstruction = systemInstruction;
    this.regexKeyword = regexKeyword;
    this.regex = new RegExp(`^(okay|ok|hey|hay) (${this.regexKeyword})$`, "i");
    this.postAnswerToBotsChannel = postAnswerToBotsChannel;
  }

  handleQuestion(question: string): Promise<string> {
    return openAi.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: this.systemInstruction,
          },
          { role: "user", content: question },
        ],
        model: "gpt-4o-mini",
      })
      .then((completion) => {
        const response = completion.choices[0].message.content;
        if (response) {
          return response;
        } else {
          throw "Did not recieve response";
        }
      });
  }
}

let state: { [key: string]: Personality } = {};

// Rules run in imperative order (top to bottom)
// it is very important the cancel, then answer, then question are in this order
// for the state to be parsed properly (this is kinda sketchy)
export default [
  new Rule({
    description: "cancel asking question",
    utterance: (utterance) => {
      if (utterance.match(/^(stop|cancel)$/i)) {
        state = {};
      }
    },
  }),
  new Rule({
    description: "ask AI question",
    utterance: (utterance, memberId) => {
      if (memberId in state) {
        const personality = state[memberId];
        personality
          .handleQuestion(utterance)
          .then((answer) => {
            playAudio(answer);
            winston.info(
              `Question - ${utterance} (${findMember(memberId).displayName})`
            );
            if (personality.postAnswerToBotsChannel) {
              findTextChannel(constants.discord.channelIds.BOTS).send(
                `A collaboration between <@${constants.discord.memberIds.CANNA_BOT}> and <@${memberId}>\n\`${utterance}\`\n\n${answer}`
              );
            }
          })
          .catch((e) => {
            playAudio("error.mp3");
            winston.error(e);
          });
        delete state[memberId];
      }
    },
  }),
].concat(
  [
    new Personality(
      "You are an assistant who creates haikus about Dota 2",
      "haiku",
      true
    ),
    new Personality(
      "You are an assistant who creates limericks about Dota 2",
      "limerick|poem",
      true
    ),
    new Personality(
      "You are a funny assistant who answers questions in one short sentence. Respond with puns when possible.",
      "dad"
    ),
    new Personality(
      "You are a helpful assistant who answers questions in one short sentence.",
      "bot|but|bought"
    ),
  ].map(
    (personality) =>
      new Rule({
        description: `${personality.regexKeyword} parse that you are asking AI something`,
        utterance: (utterance, memberId) => {
          if (utterance.match(personality.regex)) {
            state[memberId] = personality;
            playAudio("success.mp3");
            winston.info(`Question - Trigger - ${utterance}`);
          }
        },
      })
  )
);

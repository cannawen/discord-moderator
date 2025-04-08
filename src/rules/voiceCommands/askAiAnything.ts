import { findMember, findTextChannel, playAudio } from "../../helpers";
import constants from "../../constants";
import OpenAi from "openai";
import Rule from "../../Rule";
import winston from "winston";

const openAi = new OpenAi({ apiKey: constants.openAi.CHATGPT_SECRET_KEY });

class Personality {
  regexKeyword: string;
  regex: RegExp;
  postAnswerToBotsChannel: boolean;
  promptHandler: (utterance: string) => Promise<string>;

  constructor(
    regexKeyword: string,
    promptHandler: (utterance: string) => Promise<string>,
    postAnswerToBotsChannel: boolean = false
  ) {
    this.regexKeyword = regexKeyword;
    this.regex = new RegExp(`^(okay|ok|hey|hay) (${this.regexKeyword})$`, "i");
    this.postAnswerToBotsChannel = postAnswerToBotsChannel;
    this.promptHandler = promptHandler;
  }
}

function handleQuestion(question: string, system: string): Promise<string> {
  return openAi.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content: system,  
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
        
        personality.promptHandler(utterance)
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
      "haiku",
      (utterance) => handleQuestion(utterance, "You are an assistant who creates haikus about Dota 2"),
      true
    ),
    new Personality(
      "limerick|poem",
      (utterance) => handleQuestion(utterance, "You are an assistant who creates limericks about Dota 2"),
      true
    ),
    new Personality(
      "dad",
      (utterance) => handleQuestion(utterance, "You are a funny assistant who answers questions in one short sentence. Respond with puns when possible."),
    ),
    new Personality(
      "bot|bought",
      (utterance) => handleQuestion(utterance, "You are a helpful assistant who answers questions in one short sentence."),
    ),
    new Personality(
      "waiter",
      (utterance) => handleQuestion(utterance, "You are a funny intelligent waiter at a restaurant who only responds with puns relating to the object in the soup. Respond only in a single sentence."),
    )
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

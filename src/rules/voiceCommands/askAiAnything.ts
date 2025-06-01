import { createImage, handleQuestion } from "../../openAiClient";
import { findMember, findTextChannel, playAudio } from "../../helpers";
import constants from "../../constants";
import Rule from "../../Rule";
import winston from "winston";

class Personality {
  regexKeyword: string;
  regex: RegExp;
  promptHandler: (utterance: string) => Promise<string>;
  successHandler: (prompt: string, response: string, memberId: string) => void

  constructor(
    regexKeyword: string,
    promptHandler: (utterance: string) => Promise<string>,
    successHandler: (prompt: string, response: string, memberId: string) => void,
  ) {
    this.regexKeyword = regexKeyword;
    this.regex = new RegExp(`^(okay|ok) (${this.regexKeyword})$`, "i");
    this.promptHandler = promptHandler;
    this.successHandler = successHandler;
  }
}

function playResponseAndPost(prompt: string, response: string, memberId: string)  {
  playAudio(response);
  winston.info(
    `Question - ${response} (${findMember(memberId).displayName})`
  );
  findTextChannel(constants.discord.channelIds.BOTS).send(
    `A collaboration between <@${memberId}> and <@${constants.discord.memberIds.CANNA_BOT}>\n\`\`\`\n${response}\n\`\`\``
  );
}

function playResponse(prompt: string, response: string, memberId: string) {
  playAudio(response);
  winston.info(
    `Question - ${response} (${findMember(memberId).displayName})`
  );
}

function postPicture(prompt: string, url: string, memberId: string) {
    playAudio("success.mp3")
    findTextChannel(constants.discord.channelIds.BOTS).send(`\`${prompt}\` by <@${memberId}> and <@${constants.discord.memberIds.CANNA_BOT}>`)
    findTextChannel(constants.discord.channelIds.BOTS).send(url)
    winston.info(
        `Picture - ${prompt} ${url} (${findMember(memberId).displayName})`
    );
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
            personality.successHandler(utterance, answer, memberId)
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
      "draw|imagine",
      (utterance) => { 
        playAudio(`processing ${utterance}`);
        return createImage(utterance)
      },
      postPicture,
    ),
    new Personality(
      "haiku",
      (utterance) => handleQuestion(utterance, "You are an assistant who creates haikus about Dota 2"),
      playResponseAndPost,
    ),
    new Personality(
      "limerick|poem",
      (utterance) => handleQuestion(utterance, "You are an assistant who creates limericks about Dota 2"),
      playResponseAndPost
    ),
    new Personality(
      "bot|bought|siri|cortana|alexa|google|chatgpt|gpt|openai|assistant",
      (utterance) => handleQuestion(utterance, "You are a helpful assistant who answers questions in one short sentence."),
      playResponse,
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

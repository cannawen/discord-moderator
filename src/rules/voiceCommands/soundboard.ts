import { findMember, playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

function chooseRandomFromArray(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

const TRIGGER_PHRASES = [
  "sound ?board",
  "voice ?lines?",
  "priceline",
  "boyfriend",
  "first line",
];

class Sound {
  private fileNameOrNamesArray: string | string[];
  public regex: RegExp;

  // If no regexString provided, use fileName as regexString
  constructor(
    fileName: string | string[],
    regexString?: string,
    trigger: boolean = true
  ) {
    this.fileNameOrNamesArray = fileName;
    this.regex = new RegExp(
      `^(${trigger ? TRIGGER_PHRASES.join("|") : ""}) ?(${
        regexString || fileName
      })$`,
      "i"
    );
  }

  description(): string {
    return `${
      Array.isArray(this.fileNameOrNamesArray)
        ? this.fileNameOrNamesArray.join("/")
        : this.fileNameOrNamesArray
    } voiceline`;
  }

  fileName(): string {
    if (Array.isArray(this.fileNameOrNamesArray)) {
      return chooseRandomFromArray(this.fileNameOrNamesArray);
    } else {
      return this.fileNameOrNamesArray;
    }
  }
}

export default [
  new Sound("slayTogether", "(play|win|lose|blues|slay|when)? ?together"),
  new Sound("faster"),
  new Sound("player"),
  new Sound(["egg-canna", "egg-spearit"], "eggs?"),
  new Sound("egg-canna", "eggs? 1"),
  new Sound("egg-spearit", "eggs? 2"),
  new Sound("bash", "bash|bosch|back"),
  new Sound("pretty"),
  new Sound(["hk-canna", "hk-crash"], "hk"),
  new Sound("hk-canna", "hk 1"),
  new Sound("hk-crash", "hk 2"),
  new Sound("highground", "high ?ground"),
  new Sound("despacito"),
  new Sound(
    "despacito",
    "((that is|this is|that's) so sad)|(Alexa play despacito)|((that is|this is|that's) so sad Alexa play despacito)",
    false
  ),
  new Sound("shame", "shame|walk of shame"),
  new Sound("shame", "walk of shame", false),
].map(
  (sound) =>
    new Rule({
      description: sound.description(),
      utterance: (utterance, memberId) => {
        if (utterance.match(sound.regex)) {
          winston.info(
            `Audio - soundboard triggered with phrase "${utterance}" (${
              findMember(memberId).displayName
            })`
          );
          playAudio(`soundboard/${sound.fileName()}.mp3`);
        }
      },
    })
);

import { findMember, playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

function chooseRandomFromArray(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

class Sound {
  private fileNameOrNamesArray: string | string[];
  public regex: RegExp;

  constructor(
    fileName: string | string[],
    regexString?: string,
    trigger: boolean = true
  ) {
    this.fileNameOrNamesArray = fileName;
    this.regex = new RegExp(
      `^(${trigger ? TRIGGER_PHRASES : ""}) ?(${regexString || fileName})$`,
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

const TRIGGER_PHRASES = [
  "sound ?board",
  "voice ?lines?",
  "priceline",
  "boyfriend",
  "first line",
].join("|");

// ["file name" or ["array", "of file names"], "regex that triggers the voiceline (optional - if different than file name)"]
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
  new Sound(
    "despacito",
    "((that is|this is|that's) so sad)|(Alexa play despacito)|((that is|this is|that's) so sad Alexa play despacito)",
    false
  ),
].map(
  (sound) =>
    new Rule({
      description: sound.description(),
      utterance: (utterance, memberId) => {
        if (utterance.match(sound.regex)) {
          winston.info(
            `Audio - voiceline triggered with phrase "${utterance}" (${
              findMember(memberId).displayName
            })`
          );
          playAudio(`voicelines/${sound.fileName()}.mp3`);
        }
      },
    })
);

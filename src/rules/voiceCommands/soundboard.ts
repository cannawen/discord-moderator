import { findMember, playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

const TRIGGER_PHRASES = [
  "sound ?board",
  "voice ?lines?",
  "priceline",
  "boyfriend",
  "first line",
  "alexa play",
];

class Sound {
  private fileNameOrNamesArray: string | string[];
  public regex: RegExp;

  // If no regexString provided, use fileName as regexString
  // Kind of sketchy. If fileName is an array, regexString must be provided
  // (but it is not enforced programatically)
  constructor(
    fileName: string | string[],
    regexString?: string,
    triggerRequired: boolean = true
  ) {
    this.fileNameOrNamesArray = fileName;
    this.regex = new RegExp(
      `^(${TRIGGER_PHRASES.join("|")})${triggerRequired ? "" : "?"} ?(${
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
      return this.fileNameOrNamesArray[
        Math.floor(Math.random() * this.fileNameOrNamesArray.length)
      ];
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
  new Sound(["hk-canna", "hk-crash", "hk-both"], "hk"),
  new Sound("hk-canna", "hk 1"),
  new Sound("hk-crash", "hk 2"),
  new Sound("hk-both", "hk 3"),
  new Sound("highground", "high ?ground"),
  new Sound("despacito"),
  new Sound(
    "despacito",
    "(that is|this is|that's) so sad( Alexa play despacito)?",
    false
  ),
  new Sound("shame", "shame"),
  new Sound("shame", "walk of shame", false),
  new Sound("headbonk", "head ?b..(k|g)", false),
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

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
  "boyfreind",
  "first line",
].join("|");

// ["file name" or ["array", "of file names"], "regex that triggers the voiceline (optional - if different than file name)"]
export default [
  ["slayTogether", "(play|win|lose|blues|slay|when)? ?together"],
  ["faster"],
  ["player"],
  [["egg-canna", "egg-spearit"], "eggs?"],
  ["bash", "bash|bosch|back"],
].map(
  ([fileNameOrNames, regexString]) =>
    new Rule({
      description: `${
        Array.isArray(fileNameOrNames)
          ? fileNameOrNames.join("/")
          : fileNameOrNames
      } voiceline`,
      utterance: (utterance, memberId) => {
        const fileName = Array.isArray(fileNameOrNames)
          ? chooseRandomFromArray(fileNameOrNames)
          : fileNameOrNames;

        if (
          utterance.match(
            new RegExp(
              `^(${TRIGGER_PHRASES}) (${regexString || fileName})$`,
              "i"
            )
          )
        ) {
          winston.info(
            `Audio - voiceline triggered with phrase "${utterance}" (${
              findMember(memberId).displayName
            })`
          );
          playAudio(`voicelines/${fileName}.mp3`);
        }
      },
    })
);

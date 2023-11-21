import { playAudio } from "../helpers";
import Rule from "../Rule";

function chooseRandomFromArray(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

const TRIGGER = "(soundboard|voiceline|priceline|boyfriend|first line)";

// ["file name" or ["array", "of file names"], "regex that triggers the voiceline (optional - if different than file name)"]
export default [
  ["slayTogether", "(play|win|lose|blues|slay|when)? ?together"],
  ["faster"],
  ["player"],
  [["egg-canna", "egg-spearit"], "eggs?"],
  ["bash", "bosch|bash|back"],
].map(
  ([fileNameOrNames, regexString]) =>
    new Rule({
      description: `${regexString || fileNameOrNames} voiceline`,
      utterance: (utterance) => {
        let fileName = Array.isArray(fileNameOrNames)
          ? chooseRandomFromArray(fileNameOrNames)
          : fileNameOrNames;
        if (
          utterance.match(
            new RegExp(`^${TRIGGER} ${regexString || fileName}$`, "i")
          )
        ) {
          playAudio(`voicelines/${fileName}.mp3`);
        }
      },
    })
);

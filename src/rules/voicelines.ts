import { playAudio } from "../helpers";
import Rule from "../Rule";

// [file name, regex that triggers the voiceline (optional - if different than file name)]
export default [
  ["slayTogether", "(play|win|lose|blues|slay|when) together"],
  ["faster"],
  ["player"],
].map(
  ([fileName, regexString]) =>
    new Rule({
      description: `${fileName} voiceline`,
      utterance: (utterance) => {
        if (utterance.match(new RegExp(`^${regexString || fileName}$`, "i"))) {
          playAudio(`voicelines/${fileName}.mp3`);
        }
      },
    })
);

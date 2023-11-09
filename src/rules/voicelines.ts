import { playAudio } from "../helpers";
import Rule from "../Rule";

export default [
  ["(play|win|lose|blues|slay|when) together", "slayTogether"],
  ["faster", "faster"],
].map(
  ([regexString, fileName]) =>
    new Rule({
      description: `${fileName} voiceline`,
      utterance: (utterance) => {
        if (utterance.match(new RegExp(`^${regexString}$`, "i"))) {
          playAudio(`voicelines/${fileName}.mp3`);
        }
      },
    })
);

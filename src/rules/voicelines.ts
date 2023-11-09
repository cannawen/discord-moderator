import { playAudio } from "../helpers";
import Rule from "../Rule";

// [file name, regex that triggers the voiceline (optional - if different than file name)]
export default [
  ["slayTogether", "(play|win|lose|blues|slay|when) together"],
  ["faster"],
  ["player"],
]
  .map(
    ([fileName, regexString]) =>
      new Rule({
        description: `${fileName} voiceline`,
        utterance: (utterance) => {
          if (
            utterance.match(new RegExp(`^${regexString || fileName}$`, "i"))
          ) {
            playAudio(`voicelines/${fileName}.mp3`);
          }
        },
      })
  )
  .concat(
    new Rule({
      description: "egg voiceline",
      utterance: (utterance) => {
        if (utterance.match(/^egg$/i)) {
          if (Math.random() < 0.5) {
            playAudio("voicelines/egg-canna.mp3");
          } else {
            playAudio("voicelines/egg-spearit.mp3");
          }
        }
      },
    })
  );

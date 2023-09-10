import Rule from "../Rule";
import { playAudio } from "../helpers";

export default new Rule({
  description: "play slay together audio",
  utterance: (utterance) => {
    if (utterance.match(/^(play|win|lose|blues|slay) together$/i)) {
      playAudio("slayTogether.mp3");
    }
  },
});

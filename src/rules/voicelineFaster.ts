import { playAudio } from "../helpers";
import Rule from "../Rule";

export default new Rule({
  description: `play "faster than your friends" voiceline`,
  utterance: (utterance) => {
    if (utterance.match(/^faster$/i)) {
      playAudio("faster.mp3");
    }
  },
});

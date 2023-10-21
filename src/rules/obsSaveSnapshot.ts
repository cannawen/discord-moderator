import Rule from "../Rule";
import obsClient from "../obsClient";
import { playAudio } from "../helpers";

export default new Rule({
  description: "when someone says 'snapshot' record OBS stream",
  utterance: (utterance) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      playAudio("photo.mp3");
      setTimeout(() => {
        obsClient.clipCanna().catch(() => playAudio("error.mp3"));
        obsClient.clipTeazy().catch(() => playAudio("error.mp3"));
      }, 5 * 1000);
    }
  },
});

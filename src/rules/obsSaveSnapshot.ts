import Rule from "../Rule";
import obsClient from "../obsClient";
import { playAudio } from "../helpers";

export default new Rule({
  description: "when someone says 'snapshot' record OBS stream",
  utterance: (utterance) => {
    if (utterance.match(/^(snapshot|Snapchat)$/i)) {
      obsClient
        .clip()
        .then(() => playAudio("success.mp3"))
        .catch(() => playAudio("error.mp3"));
    }
  },
});

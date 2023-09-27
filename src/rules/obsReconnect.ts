import Rule from "../Rule";
import { playAudio } from "../helpers";
import obsClient from "../obsClient";

export default new Rule({
  description:
    "Reconnect voice command triggers bot to re-initialize obs client",
  utterance: (utterance) => {
    if (utterance.match(/^reconnect$/i)) {
      obsClient
        .connect()
        .then(() => playAudio("success.mp3"))
        .catch(() => playAudio("error.mp3"));
    }
  },
});

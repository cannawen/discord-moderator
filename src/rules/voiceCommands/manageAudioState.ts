import { disableAudioForAnHour, enableAudio, playAudio } from "../../helpers";
import Rule from "../../Rule";

export default new Rule({
  description: "disable audio for an hour",
  utterance: (utterance, memberId) => {
    if (utterance.match(/^enable audio$/i)) {
      enableAudio();
      playAudio("success.mp3");
    }
    if (utterance.match(/^disable audio$/i)) {
      playAudio("success.mp3");
      disableAudioForAnHour();
    }
  },
});

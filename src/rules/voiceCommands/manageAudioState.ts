import {
  disableAudioForAnHour,
  enableAudio,
  playAudio,
  stopAudio,
} from "../../helpers";
import Rule from "../../Rule";
import constants from "../../constants";

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
    if (utterance.match(/^(stop audio|stop|cancel)$/i)) {
      stopAudio();
    }
  },
});

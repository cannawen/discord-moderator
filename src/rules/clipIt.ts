import Rule from "../Rule";
import obsClient from "../obsClient";

export default new Rule({
  description: "when someone says 'clip it' then record OBS stream",
  utterance: (utterance) => {
    if (utterance.match(/^(snapshot|Snapchat|unlucky)$/i)) {
      obsClient.clip();
    }
  },
});

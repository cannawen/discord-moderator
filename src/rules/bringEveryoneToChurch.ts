import { findGuild, findVoiceChannel, playAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

export default new Rule({
  description:
    '"take me to church" moves all members connected to any voice channel to The Church of Rico',
  utterance: (utterance) => {
    if (utterance.match(/^take (me|us) to church$/i)) {
      findGuild()
        .members.cache.filter((m) => m.voice.channel)
        .forEach((m) => {
          m.voice.setChannel(
            findVoiceChannel(constants.channelIds.THE_CHURCH_OF_RICO)
          );
        });
      setTimeout(() => {
        playAudio("holy.mp3");
      }, 1000);
    }
  },
});

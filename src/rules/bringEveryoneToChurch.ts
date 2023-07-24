import { findVoiceChannel, playAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

export default new Rule({
  description:
    '"take me to church" moves all members connected to any voice channel to The Church of Rico',
  utterance: (guild, utterance) => {
    if (utterance.match(/^take (me)|(us) to church$/i)) {
      guild.members.cache
        .filter((m) => m.voice.channel)
        .forEach((m) => {
          m.voice.setChannel(
            findVoiceChannel(constants.channelIds.THE_CHURCH_OF_RICO)
          );
        });
      playAudio("holy.mp3");
    }
  },
});

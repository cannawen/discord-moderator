import { Guild, VoiceChannel } from "discord.js";
import { playAudio, stopAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

let splittingMode = false;

function moveToChannel(guild: Guild, memberId: string, toChannelId: string) {
  const toChannel = guild.channels.cache.find((c) => c.id === toChannelId);
  const member = guild.members.cache.find((m) => m.id === memberId);
  member?.voice.setChannel(toChannel as VoiceChannel);
}

export default new Rule({
  description:
    '"should I stay or should I go" triggers in house mode, listening to "radiant" or "dire"',
  utterance: (guild, utterance, memberId) => {
    if (splittingMode) {
      if (utterance.match(/^radiant$/i)) {
        moveToChannel(guild, memberId, constants.channelIds.RADIANT);
      }
      if (utterance.match(/^(dyer)|(tire)|(dire)$/i)) {
        moveToChannel(guild, memberId, constants.channelIds.DIRE);
      }
    }
    if (utterance.match(/^should i stay or should i go$/i)) {
      splittingMode = true;
      playAudio("shouldIStayOrShouldIGo.mp3");
    }
    if (utterance.match(/^(done)|(cancel)|(stop)$/)) {
      splittingMode = false;
      stopAudio();
    }
  },
});

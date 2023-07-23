import { Guild, VoiceChannel } from "discord.js";
import { playAudio, stopAudio } from "../helpers";
import constants from "../constants";
import Rule from "../Rule";

let splittingMode = false;

let radiantTeam: string[] = [];
let direTeam: string[] = [];

function moveToChannel(guild: Guild, memberIds: string[], toChannelId: string) {
  const toChannel = guild.channels.cache.find((c) => c.id === toChannelId);
  const members = guild.members.cache.filter((m) => memberIds.includes(m.id));
  members.forEach((m) => m.voice.setChannel(toChannel as VoiceChannel));
}

export default new Rule({
  description:
    '"should I stay or should I go" triggers in house mode, listening to "radiant" or "dire"',
  utterance: (guild, utterance, memberId) => {
    if (splittingMode) {
      if (utterance.match(/^radiant$/i)) {
        radiantTeam.push(memberId);
      }
      if (utterance.match(/^(dyer)|(dire)$/i)) {
        direTeam.push(memberId);
      }
      if (
        memberId === constants.memberIds.CANNA ||
        utterance.match(/^done$/i)
      ) {
        splittingMode = false;
        moveToChannel(guild, radiantTeam, constants.channelIds.RADIANT);
        moveToChannel(guild, direTeam, constants.channelIds.DIRE);
        stopAudio();
      }
    }
    if (utterance.match(/^should i stay or should i go$/i)) {
      splittingMode = true;

      radiantTeam = [];
      direTeam = [];

      playAudio(guild.id, "shouldIStayOrShouldIGo.mp3");
    }
    if (utterance.match(/^(cancel)|(stop)$/)) {
      splittingMode = false;
      stopAudio();
    }
  },
});

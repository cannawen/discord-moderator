import { Guild, VoiceChannel } from "discord.js";
import Rule from "../Rule";
import constants from "../constants";

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
  utterance: (guild, utterance, userId) => {
    if (splittingMode) {
      if (utterance.match(/^radiant$/i)) {
        radiantTeam.push(userId);
      }
      if (utterance.match(/^(dyer)|(dire)$/i)) {
        direTeam.push(userId);
      }
      if (userId === constants.userIds.CANNA) {
        splittingMode = false;
        moveToChannel(guild, radiantTeam, constants.channelIds.RADIANT);
        moveToChannel(guild, direTeam, constants.channelIds.DIRE);
      }
    }
    if (utterance.match(/^should i stay or should i go$/i)) {
      splittingMode = true;

      radiantTeam = [];
      direTeam = [];
      // add user feedback
    }
    if (utterance.match(/^cancel$/)) {
      splittingMode = false;
    }
  },
});

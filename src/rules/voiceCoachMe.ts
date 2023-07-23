import { VoiceChannel } from "discord.js";
import Rule from "../Rule";
import constants from "../constants";

export default new Rule({
  description: "bring dota-coach to a member's voice channel",
  utterance: (guild, utterance, memberId) => {
    if (utterance.match(/^coach me$/i)) {
      const member = guild.members.cache.find((m) => m.id === memberId);
      const bot = guild.members.cache.find(
        (m) => m.id === constants.memberIds.DOTA_COACH
      );
      bot?.voice.setChannel(member?.voice.channel as VoiceChannel);
    }
  },
});

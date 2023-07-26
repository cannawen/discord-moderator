import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";

export default new Rule({
  description: "the bot joins whatever voice channel Canna is in",
  tick: () => {
    const canna = findMember(constants.memberIds.CANNA);
    const cannaChannel = canna.voice.channel;

    const bot = findMember(constants.memberIds.CANNA_BOT);
    const botChannel = bot.voice.channel;

    // if bot is currently in a channel different from Canna
    if (cannaChannel && botChannel !== cannaChannel) {
      // join bot to channel
      joinVoiceChannel({
        adapterCreator: cannaChannel.guild.voiceAdapterCreator,
        channelId: cannaChannel.id,
        guildId: constants.guildIds.BEST_DOTA,
        selfDeaf: false,
        selfMute: false,
      });
    }

    // if Canna is not in a channel but bot is in a channel
    if (!cannaChannel && botChannel) {
      // disconnect bot
      getVoiceConnection(constants.guildIds.BEST_DOTA)?.destroy();
    }
  },
});

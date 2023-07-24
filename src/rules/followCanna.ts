import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";
import { VoiceBasedChannel } from "discord.js";

let savedCannaChannel: VoiceBasedChannel | undefined;

export default new Rule({
  description: "the bot joins whatever voice channel Canna is in",
  tick: (guild) => {
    const canna = findMember(constants.memberIds.CANNA);
    const currentChannel = canna?.voice.channel;

    // if Canna is currently in a channel different from saved channel
    if (currentChannel && currentChannel !== savedCannaChannel) {
      // save channel
      savedCannaChannel = currentChannel;
      // join bot to channel
      joinVoiceChannel({
        adapterCreator: currentChannel.guild.voiceAdapterCreator,
        channelId: currentChannel.id,
        guildId: guild.id,
        selfDeaf: false,
        selfMute: false,
      });
    }

    // if Canna is not in a channel but we have a saved channel
    if (!currentChannel && savedCannaChannel) {
      // disconnect bot
      getVoiceConnection(guild.id)?.destroy();
      // reset saved channel
      savedCannaChannel = undefined;
    }
  },
});

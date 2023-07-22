import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import cron from "node-cron";
import Rule from "../Rule";
import { VoiceBasedChannel } from "discord.js";

export default new Rule({
  description: "the bot joins whatever voice channel Canna is in",
  registerGuild: (guild) => {
    const canna = guild.members.cache.find(
      (m) => m.id === process.env.USER_ID_CANNA!
    );
    let connection: VoiceConnection;
    let cannaChannel: VoiceBasedChannel | undefined;

    cron.schedule("*/1 * * * * *", () => {
      const currentChannel = canna?.voice.channel;

      // if Canna is currently in a channel different from saved channel
      if (currentChannel && currentChannel !== cannaChannel) {
        // save channel
        cannaChannel = currentChannel;
        // join bot to channel
        connection = joinVoiceChannel({
          adapterCreator: currentChannel.guild.voiceAdapterCreator,
          channelId: currentChannel.id,
          guildId: guild.id,
          selfDeaf: false,
          selfMute: false,
        });
      }

      // if Canna is not in a channel but we have a saved channel
      if (!currentChannel && cannaChannel) {
        // disconnect bot
        connection.destroy();
        // reset saved channel
        cannaChannel = undefined;
      }
    });
  },
});

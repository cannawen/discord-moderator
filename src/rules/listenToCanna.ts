import { Guild, VoiceBasedChannel } from "discord.js";
import cron from "node-cron";
import { getVoiceConnection } from "@discordjs/voice";
import Rule from "../Rule";
import stt from "../speechToText";

function theChurchOfRicoChannel(guild: Guild) {
  return guild.channels.cache.find(
    (c) => c.id === process.env.CHANNEL_ID_CHURCH_OF_RICO
  ) as VoiceBasedChannel;
}

export default new Rule(
  'the bot listens when Canna says "take me/us to church" and moves users to the The Church of Rico',
  (guild) => {
    let listening = false;

    cron.schedule("*/2 * * * * *", () => {
      const connection = getVoiceConnection(guild.id);
      if (connection && !listening) {
        listening = true;

        connection.receiver.speaking.on("start", (userId) => {
          if (userId === process.env.USER_ID_CANNA) {
            stt.transcribe(connection.receiver, userId).then((utterance) => {
              if (!utterance) return;

              console.log(utterance);

              if (utterance.match(/^take us to( church)?$/)) {
                guild.members.cache
                  .filter((m) => m.voice.channel)
                  .forEach((m) => {
                    m.voice.setChannel(theChurchOfRicoChannel(guild));
                  });
              }

              if (utterance.match(/^take me to( church)?$/)) {
                const fromChannelId = guild.members.cache.find(
                  (m) => m.id === process.env.USER_ID_CANNA
                )?.voice.channelId;
                const fromChannel = guild.channels.cache.find(
                  (c) => c.id === fromChannelId
                ) as VoiceBasedChannel;
                fromChannel.members.forEach((m) =>
                  m.voice.setChannel(theChurchOfRicoChannel(guild))
                );
              }
            });
          }
        });
      }
      if (!connection) {
        listening = false;
      }
    });
  }
);

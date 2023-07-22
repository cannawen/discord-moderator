import { getVoiceConnection, VoiceConnection } from "@discordjs/voice";
import cron from "node-cron";
import Rule from "../Rule";
import stt from "../speechToText";
import { VoiceBasedChannel } from "discord.js";

export default new Rule((guild) => {
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

            if (utterance?.match(/^take us to church$/)) {
              guild.members.cache
                .filter((m) => m.voice.channel)
                .forEach((m) => {
                  m.voice.setChannel(
                    guild.channels.cache.find(
                      (c) => c.id === process.env.CHANNEL_ID_CHURCH_OF_RICO
                    ) as VoiceBasedChannel
                  );
                });
            }
          });
        }
      });
    }
    if (!connection) {
      listening = false;
    }
  });
});

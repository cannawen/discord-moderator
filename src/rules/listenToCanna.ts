import { Guild, VoiceBasedChannel } from "discord.js";
import constants from "../constants";
import { getVoiceConnection } from "@discordjs/voice";
import Rule from "../Rule";
import stt from "../speechToText";

function theChurchOfRicoChannel(guild: Guild) {
  return guild.channels.cache.find(
    (c) => c.id === constants.channelIds.THE_CHURCH_OF_RICO
  ) as VoiceBasedChannel;
}

// the bot listens when Canna says "take me/us to church" and moves users to the The Church of Rico
export default ((_, guild, onTick) => {
  let listening = false;

  onTick(() => {
    const connection = getVoiceConnection(guild.id);
    if (connection && !listening) {
      listening = true;

      connection.receiver.speaking.on("start", (userId) => {
        if (userId === constants.userIds.CANNA) {
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
                (m) => m.id === constants.userIds.CANNA
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
}) as Rule;

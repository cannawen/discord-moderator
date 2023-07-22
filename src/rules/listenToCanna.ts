import { Guild, VoiceBasedChannel } from "discord.js";
import constants from "../constants";
import Rule from "../Rule";

function theChurchOfRicoChannel(guild: Guild) {
  return guild.channels.cache.find(
    (c) => c.id === constants.channelIds.THE_CHURCH_OF_RICO
  ) as VoiceBasedChannel;
}

export default new Rule({
  description:
    'the bot listens when Canna says "take me/us to church" and moves users to the The Church of Rico',
  utterance: (guild, utterance) => {
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
  },
});

import { Guild, VoiceBasedChannel } from "discord.js";
import constants from "../constants";
import { playAudio } from "../helpers";
import Rule from "../Rule";

function theChurchOfRicoChannel(guild: Guild) {
  return guild.channels.cache.find(
    (c) => c.id === constants.channelIds.THE_CHURCH_OF_RICO
  ) as VoiceBasedChannel;
}

export default [
  // new Rule({
  //   description:
  //     '"take me to church" moves member in current channel to The Church of Rico',
  //   utterance: (guild, utterance) => {
  //     if (utterance.match(/^take me to( church)?$/i)) {
  //       const fromChannelId = guild.members.cache.find(
  //         (m) => m.id === constants.memberIds.CANNA
  //       )?.voice.channelId;
  //       const fromChannel = guild.channels.cache.find(
  //         (c) => c.id === fromChannelId
  //       ) as VoiceBasedChannel;
  //       fromChannel.members.forEach((m) =>
  //         m.voice.setChannel(theChurchOfRicoChannel(guild))
  //       );
  //     }
  //   },
  // }),
  new Rule({
    description:
      '"take me to church" moves all members connected to any voice channel to The Church of Rico',
    utterance: (guild, utterance) => {
      if (utterance.match(/^take me to church$/i)) {
        guild.members.cache
          .filter((m) => m.voice.channel)
          .forEach((m) => {
            m.voice.setChannel(theChurchOfRicoChannel(guild));
          });
        playAudio(guild.id, "holy.mp3");
      }
    },
  }),
];

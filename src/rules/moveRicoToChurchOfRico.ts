import { findMember, findVoiceChannel, moveToVoiceChannel } from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";

function moveToChurchIfRicoFound(channel: string) {
  if (findMember(constants.memberIds.RICO).voice.channelId === channel) {
    moveToVoiceChannel(
      constants.memberIds.RICO,
      constants.channelIds.THE_CHURCH_OF_RICO
    );
    moveToVoiceChannel(
      findVoiceChannel(channel).members,
      constants.channelIds.THE_CHURCH_OF_RICO
    );
  }
}

export default new Rule({
  description:
    "when Rico joins the Dota 2 or General channel, move him and everyone in that channel to The Church of Rico",
  start: () => {
    client.on(Events.VoiceStateUpdate, (_, voiceStatus) => {
      if (voiceStatus.member?.id !== constants.memberIds.RICO) return;

      moveToChurchIfRicoFound(constants.channelIds.DOTA_2);
      moveToChurchIfRicoFound(constants.channelIds.GENERAL);
    });
  },
});

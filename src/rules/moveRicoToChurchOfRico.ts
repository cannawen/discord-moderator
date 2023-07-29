import { Events, GuildMember } from "discord.js";
import { findVoiceChannel, moveMemberToVoiceChannel } from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import Rule from "../Rule";

function moveMembersToChurch(members: GuildMember[]) {
  members.forEach((m) =>
    moveMemberToVoiceChannel(m, constants.channelIds.THE_CHURCH_OF_RICO)
  );
}

export default new Rule({
  description:
    "when Rico joins the Dota 2 or General channel, move him and everyone in that channel to The Church of Rico",
  start: () => {
    client.on(Events.VoiceStateUpdate, (_, voiceStatus) => {
      if (voiceStatus.member?.id !== constants.memberIds.RICO) return;

      const ricoChannel = voiceStatus.channelId;

      if (ricoChannel === constants.channelIds.DOTA_2) {
        moveMembersToChurch([
          voiceStatus.member,
          ...findVoiceChannel(constants.channelIds.DOTA_2).members.values(),
        ]);
      }

      if (ricoChannel === constants.channelIds.GENERAL) {
        moveMembersToChurch([
          voiceStatus.member,
          ...findVoiceChannel(constants.channelIds.GENERAL).members.values(),
        ]);
      }
    });
  },
});

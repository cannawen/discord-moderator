import {
  findGuild,
  findMember,
  findMemberVoiceChannelId,
  findVoiceChannel,
  moveToVoiceChannel,
} from "../../helpers";
import constants from "../../constants";
import { PermissionsBitField } from "discord.js";
import Rule from "../../Rule";
import winston from "winston";

function bringFromChannelToChannel(
  fromChannelId: string | undefined | null,
  toChannelId: string
) {
  if (fromChannelId === toChannelId) return;

  winston.info(
    `Move - ${
      fromChannelId ? findVoiceChannel(fromChannelId).name : "everyone"
    } to ${findVoiceChannel(toChannelId).name}`
  );

  const membersToMove = fromChannelId
    ? findVoiceChannel(fromChannelId).members
    : findGuild().members.cache.filter((m) => m.voice.channel);

  moveToVoiceChannel(
    membersToMove.filter((m) => m.id !== constants.memberIds.CANNA_BOT),
    toChannelId
  );
}

function hasPermission(memberId: string, channel: string) {
  return findMember(memberId)
    .permissionsIn(channel)
    .has(PermissionsBitField.Flags.Connect);
}

export default new Rule({
  description:
    '"take me/us to <channel>" moves members in the current channel to <channel>. "take everybody/everyone to <channel>" moves all members connected to any voice channel',
  utterance: (utterance, memberId) => {
    const member = findMember(memberId).displayName;

    let fromChannel: string | undefined | null;
    let toChannel: string | undefined;

    if (utterance.match(/^take (me|us)/i)) {
      fromChannel = findMemberVoiceChannelId(memberId);
    }

    if (utterance.match(/^take .{2,10} to (dota 2|chaos)$/i)) {
      toChannel = constants.channelIds.DOTA_2;
    }

    if (utterance.match(/^take .{2,10} to general$/i)) {
      toChannel = constants.channelIds.GENERAL;
    }

    if (
      utterance.match(/^take .{2,10} to (secrets?|focus)$/i) &&
      hasPermission(memberId, constants.channelIds.SECRETS)
    ) {
      toChannel = constants.channelIds.SECRETS;
    }

    if (
      utterance.match(/^take .{2,10} to (real secrets?|hiding)$/i) &&
      hasPermission(memberId, constants.channelIds.REAL_SECRETS)
    ) {
      toChannel = constants.channelIds.REAL_SECRETS;
    }

    if (toChannel) {
      bringFromChannelToChannel(fromChannel, toChannel);
    }
  },
});

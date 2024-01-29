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

    if (utterance.match(/^take .{2,10} to chaos$/i)) {
      toChannel = constants.channelIds.CHAOS;
    }

    if (utterance.match(/^take .{2,10} to general$/i)) {
      toChannel = constants.channelIds.GENERAL;
    }

    if (
      utterance.match(/^take .{2,10} to focus$/i) &&
      hasPermission(memberId, constants.channelIds.FOCUS)
    ) {
      toChannel = constants.channelIds.FOCUS;
    }

    if (
      utterance.match(/^take .{2,10} to stream(ing)?$/i) &&
      hasPermission(memberId, constants.channelIds.STREAMING)
    ) {
      toChannel = constants.channelIds.STREAMING;
    }

    if (
      utterance.match(/^take .{2,10} to hiding$/i) &&
      hasPermission(memberId, constants.channelIds.HIDING)
    ) {
      toChannel = constants.channelIds.HIDING;
    }

    if (toChannel) {
      bringFromChannelToChannel(fromChannel, toChannel);
    }
  },
});

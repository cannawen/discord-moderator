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

interface RuleData {
  trigger: string;
  channel: string;
}

const data: RuleData[] = [
  { trigger: "chaos", channel: constants.channelIds.CHAOS },
  { trigger: "general", channel: constants.channelIds.GENERAL },
  { trigger: "focus", channel: constants.channelIds.FOCUS },
  { trigger: "stream(ing)?", channel: constants.channelIds.STREAMING },
  { trigger: "hiding", channel: constants.channelIds.HIDING },
];

function hasPermission(memberId: string, channel: string) {
  return findMember(memberId)
    .permissionsIn(channel)
    .has(PermissionsBitField.Flags.Connect);
}

function bringFromChannelToChannel(
  fromChannelId: string | undefined | null,
  toChannelId: string,
  memberId: string
) {
  if (fromChannelId === toChannelId) return;
  if (!hasPermission(memberId, toChannelId)) return;

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

export default data.flatMap((d) => [
  new Rule({
    description: `"take me/us to <channel>" moves members in current channel to <channel>`,
    utterance: (utterance, memberId) => {
      if (utterance.match(new RegExp(`take (me|us) to ${d.trigger}`, "i"))) {
        bringFromChannelToChannel(
          findMemberVoiceChannelId(memberId),
          d.channel,
          memberId
        );
      }
    },
  }),
  new Rule({
    description: `"take everyone/everybody to <channel>" moves all connected members to <channel>`,
    utterance: (utterance, memberId) => {
      if (
        utterance.match(new RegExp(`take every(one|body) to ${d.trigger}`, "i"))
      ) {
        bringFromChannelToChannel(null, d.channel, memberId);
      }
    },
  }),
]);

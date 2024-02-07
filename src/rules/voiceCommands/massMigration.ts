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

const ruleData: RuleData[] = [
  { trigger: "general", channel: constants.channelIds.GENERAL },
  { trigger: "chaos", channel: constants.channelIds.CHAOS },
  { trigger: "focus", channel: constants.channelIds.FOCUS },
  { trigger: "stream(ing)?", channel: constants.channelIds.STREAMING },
  { trigger: "hiding", channel: constants.channelIds.HIDING },
  // NOTE: lobby has custom migration that only pulls from Radiant/Dire
];

function hasPermission(memberId: string, channel: string) {
  return findMember(memberId)
    .permissionsIn(channel)
    .has(PermissionsBitField.Flags.Connect);
}

export default ruleData.flatMap((data) => [
  new Rule({
    description: `"take me/us to <channel>" moves members in current channel to <channel>`,
    utterance: (utterance, memberId) => {
      if (utterance.match(new RegExp(`take (me|us) to ${data.trigger}`, "i"))) {
        const fromChannelId = findMemberVoiceChannelId(memberId)!;
        const toChannelId = data.channel;

        if (fromChannelId === toChannelId) return;
        if (!hasPermission(memberId, toChannelId)) return;

        const membersToMove = findVoiceChannel(fromChannelId).members;
        moveToVoiceChannel(membersToMove, toChannelId);

        winston.info(
          `Move - ${findVoiceChannel(fromChannelId).name} to ${
            findVoiceChannel(toChannelId).name
          } (${findMember(memberId).displayName}, ${
            membersToMove.size
          } members moved)`
        );
      }
    },
  }),
  new Rule({
    description: `"take everyone/everybody to <channel>" moves all members connected to voice to <channel>`,
    utterance: (utterance, memberId) => {
      if (
        utterance.match(
          new RegExp(`take every(one|body) to ${data.trigger}`, "i")
        )
      ) {
        const toChannelId = data.channel;

        if (!hasPermission(memberId, toChannelId)) return;

        const membersToMove = findGuild().members.cache.filter(
          (m) => m.voice.channel
        );
        moveToVoiceChannel(membersToMove, toChannelId);

        winston.info(
          `Move - everyone to ${findVoiceChannel(toChannelId).name} (${
            findMember(memberId).displayName
          }, ${membersToMove.size} members moved)`
        );
      }
    },
  }),
]);

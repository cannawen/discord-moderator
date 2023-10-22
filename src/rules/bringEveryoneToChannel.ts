import { findGuild, findMember, moveToVoiceChannel } from "../helpers";
import constants from "../constants";
import { PermissionsBitField } from "discord.js";
import Rule from "../Rule";
import winston from "winston";

function bringAllToChannel(channelId: string) {
  moveToVoiceChannel(
    findGuild().members.cache.filter((m) => m.voice.channel),
    channelId
  );
}

function hasPermission(memberId: string, channel: string) {
  return findMember(memberId)
    .permissionsIn(channel)
    .has(PermissionsBitField.Flags.Connect);
}

export default new Rule({
  description: '"take me/us to <channel>" moves everyone to <channel>',
  utterance: (utterance, memberId) => {
    const member = findMember(memberId).displayName;
    if (utterance.match(/^take (me|us) to general$/i)) {
      winston.info(`Move - everyone to General (${member})`);
      bringAllToChannel(constants.channelIds.GENERAL);
    }

    if (
      utterance.match(/^take (me|us) to secrets?$/i) &&
      hasPermission(memberId, constants.channelIds.SECRETS)
    ) {
      winston.info(`Move - everyone to Secrets (${member})`);
      bringAllToChannel(constants.channelIds.SECRETS);
    }

    if (
      utterance.match(/^take (me|us) to real secrets?$/i) &&
      hasPermission(memberId, constants.channelIds.REAL_SECRETS)
    ) {
      winston.info(`Move - everyone to Real Secrets (${member})`);
      bringAllToChannel(constants.channelIds.REAL_SECRETS);
    }
  },
});

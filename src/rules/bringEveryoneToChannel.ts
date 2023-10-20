import {
  findGuild,
  findMember,
  moveToVoiceChannel,
  playAudio,
} from "../helpers";
import constants from "../constants";
import Rule from "../Rule";
import { PermissionsBitField } from "discord.js";

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
    if (utterance.match(/^take (me|us) to general$/i)) {
      bringAllToChannel(constants.channelIds.GENERAL);
    }

    if (
      utterance.match(/^take (me|us) to secrets?$/i) &&
      hasPermission(memberId, constants.channelIds.SECRETS)
    ) {
      bringAllToChannel(constants.channelIds.SECRETS);
    }

    if (
      utterance.match(/^take (me|us) to real secrets?$/i) &&
      hasPermission(memberId, constants.channelIds.REAL_SECRETS)
    ) {
      bringAllToChannel(constants.channelIds.REAL_SECRETS);
    }
  },
});

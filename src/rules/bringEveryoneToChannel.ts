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

function hasSecretPermission(memberId: string) {
  return findMember(memberId)
    .permissionsIn(constants.channelIds.SECRETS)
    .has(PermissionsBitField.Flags.ViewChannel);
}

export default new Rule({
  description: '"take me/us to <channel>" moves everyone to <channel>',
  utterance: (utterance, memberId) => {
    if (utterance.match(/^take (me|us) to church$/i)) {
      bringAllToChannel(constants.channelIds.THE_CHURCH_OF_RICO);
      setTimeout(() => {
        playAudio("holy.mp3");
      }, 1000);
    }
    if (utterance.match(/^take (me|us) to general$/i)) {
      bringAllToChannel(constants.channelIds.GENERAL);
    }

    if (utterance.match(/^take (me|us) to secrets?$/i)) {
      if (hasSecretPermission(memberId)) {
        bringAllToChannel(constants.channelIds.SECRETS);
      }
    }
  },
});

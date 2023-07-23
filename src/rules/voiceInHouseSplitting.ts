import {
  PlayerSubscription,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import { Guild, VoiceChannel } from "discord.js";
import constants from "../constants";
import Rule from "../Rule";
import path from "path";

let splittingMode = false;

let radiantTeam: string[] = [];
let direTeam: string[] = [];

let subscription: PlayerSubscription | undefined;

function moveToChannel(guild: Guild, memberIds: string[], toChannelId: string) {
  const toChannel = guild.channels.cache.find((c) => c.id === toChannelId);
  const members = guild.members.cache.filter((m) => memberIds.includes(m.id));
  members.forEach((m) => m.voice.setChannel(toChannel as VoiceChannel));
}

export default new Rule({
  description:
    '"should I stay or should I go" triggers in house mode, listening to "radiant" or "dire"',
  utterance: (guild, utterance, userId) => {
    if (splittingMode) {
      if (utterance.match(/^radiant$/i)) {
        radiantTeam.push(userId);
      }
      if (utterance.match(/^(dyer)|(dire)$/i)) {
        direTeam.push(userId);
      }
      if (userId === constants.userIds.CANNA) {
        splittingMode = false;
        moveToChannel(guild, radiantTeam, constants.channelIds.RADIANT);
        moveToChannel(guild, direTeam, constants.channelIds.DIRE);
        subscription?.player.stop();
      }
    }
    if (utterance.match(/^should i stay or should i go$/i)) {
      splittingMode = true;

      radiantTeam = [];
      direTeam = [];

      const connection = getVoiceConnection(guild.id)!;
      const player = createAudioPlayer();

      subscription = connection.subscribe(player);
      subscription?.player.play(
        createAudioResource(
          path.join(__dirname, "../../audio/shouldIStayOrShouldIGo.mp3")
        )
      );
      // add user feedback
    }
    if (utterance.match(/^cancel$/)) {
      splittingMode = false;
      subscription?.player.stop();
    }
  },
});

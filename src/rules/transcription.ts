import {
  VoiceConnectionState,
  VoiceConnectionStatus,
  getVoiceConnection,
} from "@discordjs/voice";
import constants from "../constants";
import { rules } from "../ruleManager";
import Rule from "../Rule";
import stt from "../speechToText";
import winston from "winston";

// this flag here is very sketchy - there must be a better way to do this
let listening = false;

export default new Rule({
  description: "listen for voice connection to transcribe",
  tick: () => {
    // poll for voice connection so we can capture voice to speech-to-text
    const connection = getVoiceConnection(constants.discord.guildIds.BEST_DOTA);

    if (connection && !listening) {
      listening = true;
      connection?.receiver.speaking.on("start", (memberId) => {
        stt
          .transcribe(connection.receiver, memberId)
          .then((utterance) => {
            if (!utterance) return;

            if (memberId === constants.discord.memberIds.CANNA) {
              winston.verbose(utterance);
            }

            rules
              .filter((r) => r.utterance)
              .map((r) => r.utterance!(utterance, memberId));
          })
          .catch(() => { });
      });

      connection?.addListener(
        "stateChange",
        (_, newState: VoiceConnectionState) => {
          if (newState.status === VoiceConnectionStatus.Destroyed) {
            listening = false;
          }
        }
      );
    }
  },
});

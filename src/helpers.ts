import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  PlayerSubscription,
} from "@discordjs/voice";
import path from "path";
import constants from "./constants";

let subscription: PlayerSubscription | undefined;

export function playAudio(fileName: string) {
  const connection = getVoiceConnection(constants.guildIds.BEST_DOTA)!;
  const player = createAudioPlayer();

  subscription = connection.subscribe(player);
  subscription?.player.play(
    createAudioResource(path.join(__dirname, "../audio", fileName))
  );
}

export function stopAudio() {
  subscription?.player.stop();
}

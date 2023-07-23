import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  PlayerSubscription,
} from "@discordjs/voice";
import path from "path";

let subscription: PlayerSubscription | undefined;

export function playAudio(guildId: string, fileName: string) {
  const connection = getVoiceConnection(guildId)!;
  const player = createAudioPlayer();

  subscription = connection.subscribe(player);
  subscription?.player.play(
    createAudioResource(path.join(__dirname, "../audio", fileName))
  );
}

export function stopAudio() {
  subscription?.player.stop();
}

import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";
let obsStream = new OBSWebSocket();
let obsGame = new OBSWebSocket();

function connect() {
  const gamePromise = obsGame.connect(
    `ws://${constants.obs.CANNA_GAME_SERVER}:4455`,
    constants.obs.CANNA_GAME_SERVER_PASSWORD
  );
  const streamPromise = obsStream
    .connect(
      `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
      constants.obs.CANNA_STREAM_SERVER_PASSWORD
    )
    .then(() =>
      obsStream.call("GetReplayBufferStatus").then((response) => {
        if (!response.outputActive) {
          obsStream.call("StartReplayBuffer");
        }
      })
    )
    .catch((e) => {
      console.log("failed to connect to OBS");
      throw e;
    });

  return Promise.all([gamePromise, streamPromise]);
}

function disconnect() {
  obsGame.disconnect();

  return obsStream
    .call("StopReplayBuffer")
    .finally(() => obsStream.disconnect());
}

function clip() {
  return obsStream.call("SaveReplayBuffer").catch((e) => {
    console.log("failed to save replay buffer");
    throw e;
  });
}

export default {
  connect,
  disconnect,
  clip,
};

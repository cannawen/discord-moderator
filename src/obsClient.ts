import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";

let obsStream = new OBSWebSocket();
let obsGame = new OBSWebSocket();

function connect() {
  return Promise.all([
    obsGame
      .connect(
        `ws://${constants.obs.CANNA_GAME_SERVER}:4455`,
        constants.obs.CANNA_GAME_SERVER_PASSWORD
      )
      .catch((e) => {
        console.log("failed to connect to game OBS");
        throw e;
      }),
    obsStream
      .connect(
        `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
        constants.obs.CANNA_STREAM_SERVER_PASSWORD
      )
      .then(() =>
        obsStream
          .call("GetReplayBufferStatus")
          .then((response) => {
            if (!response.outputActive) {
              return obsStream.call("StartReplayBuffer");
            }
          })
          .catch((e) => {
            console.log("failed to start replay buffer");
            throw e;
          })
      )
      .catch((e) => {
        console.log("failed to connect to stream OBS");
        throw e;
      }),
  ]);
}

function disconnect() {
  Promise.all([
    obsGame.disconnect(),
    obsStream.call("StopReplayBuffer").finally(() => obsStream.disconnect()),
  ]).catch(() => {
    console.log("failed to stop replay buffer or disconnect from OBS");
  });
}

function clip() {
  return Promise.all([
    obsGame.reidentify({}),
    obsStream.call("SaveReplayBuffer").catch((e) => {
      console.log("failed to save replay buffer");
      throw e;
    }),
  ]);
}

export default {
  connect,
  disconnect,
  clip,
};

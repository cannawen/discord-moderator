import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";

let obsStreamCanna = new OBSWebSocket();
let obsGameCanna = new OBSWebSocket();

function connect() {
  return Promise.all([
    obsGameCanna
      .connect(
        `ws://${constants.obs.CANNA_GAME_SERVER}:4455`,
        constants.obs.CANNA_GAME_SERVER_PASSWORD
      )
      .catch((e) => {
        console.log("failed to connect to game OBS");
        throw e;
      }),
    obsStreamCanna
      .connect(
        `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
        constants.obs.CANNA_STREAM_SERVER_PASSWORD
      )
      .then(() =>
        obsStreamCanna
          .call("GetReplayBufferStatus")
          .then((response) => {
            if (!response.outputActive) {
              return obsStreamCanna.call("StartReplayBuffer");
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
  return Promise.all([
    obsGameCanna.disconnect(),
    obsStreamCanna
      .call("StopReplayBuffer")
      .finally(() => obsStreamCanna.disconnect()),
  ]).catch(() => {});
}

function clip() {
  return Promise.all([
    obsGameCanna.reidentify({}),
    obsStreamCanna.call("SaveReplayBuffer").catch((e) => {
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

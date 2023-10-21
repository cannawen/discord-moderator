import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";

let obsStreamCanna = new OBSWebSocket();
let obsGameCanna = new OBSWebSocket();
let obsTeazy = new OBSWebSocket();

function connectCanna() {
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

function connectTeazy() {
  return obsTeazy
    .connect(
      `ws://${constants.obs.TEAZY_SERVER}:4455`,
      constants.obs.TEAZY_SERVER_PASSWORD
    )
    .then(() =>
      obsTeazy
        .call("GetReplayBufferStatus")
        .then((response) => {
          if (!response.outputActive) {
            return obsTeazy.call("StartReplayBuffer");
          }
        })
        .catch((e) => {
          console.log("failed to start replay buffer");
          throw e;
        })
    );
}

function disconnectCanna() {
  return Promise.all([
    obsGameCanna.disconnect(),
    obsStreamCanna
      .call("StopReplayBuffer")
      .finally(() => obsStreamCanna.disconnect()),
  ]).catch(() => {});
}

function disconnectTeazy() {
  return obsTeazy
    .call("StopReplayBuffer")
    .finally(() => obsTeazy.disconnect())
    .catch(() => {});
}

function clipCanna() {
  return Promise.all([
    obsGameCanna.reidentify({}),
    obsStreamCanna.call("SaveReplayBuffer").catch((e) => {
      console.log("failed to save replay buffer");
      throw e;
    }),
  ]);
}

function clipTeazy() {
  return obsTeazy.call("SaveReplayBuffer").catch((e) => {
    console.log("failed to save replay buffer");
    throw e;
  });
}

export default {
  connectCanna,
  connectTeazy,
  disconnectCanna,
  disconnectTeazy,
  clipCanna,
  clipTeazy,
};

import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";
let obs = new OBSWebSocket();

function connect() {
  return obs
    .connect(
      `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
      constants.obs.CANNA_STREAM_SERVER_PASSWORD
    )
    .then(() =>
      obs.call("GetReplayBufferStatus").then((response) => {
        if (!response.outputActive) {
          obs.call("StartReplayBuffer");
        }
      })
    )
    .catch((e) => {
      console.log("failed to connect to OBS");
      throw e;
    });
}

function disconnect() {
  return obs.call("StopReplayBuffer").finally(() => obs.disconnect());
}

function clip() {
  return obs.call("SaveReplayBuffer").catch((e) => {
    console.log("failed to save replay buffer");
    throw e;
  });
}

export default {
  connect,
  disconnect,
  clip,
};

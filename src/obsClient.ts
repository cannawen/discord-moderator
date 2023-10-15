import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";

let obsStream = new OBSWebSocket();

function connect() {
  return obsStream
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
    });
}

function disconnect() {
  return obsStream
    .call("StopReplayBuffer")
    .finally(() => obsStream.disconnect())
    .catch(() => {
      console.log("failed to stop replay buffer or disconnect from OBS");
    });
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

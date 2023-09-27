import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";
let obs = new OBSWebSocket();

function connect() {
  return obs
    .connect(
      constants.obs.WEBSOCKET_SERVER,
      constants.obs.WEBSOCKET_SERVER_PASSWORD
    )
    .catch((e) => {
      console.log("failed to connect to OBS");
      throw e;
    });
}

function disconnect() {
  return obs.disconnect();
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
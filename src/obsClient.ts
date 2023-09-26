import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";
let obs = new OBSWebSocket();

function connect() {
  return obs
    .connect(
      constants.obs.WEBSOCKET_SERVER,
      constants.obs.WEBSOCKET_SERVER_PASSWORD
    )
    .then(() => {
      console.log("connected to OBS");
    })
    .catch((e) => {
      console.log("failed to connect to OBS");
      console.log(e);
    });
}

function disconnect() {
  return obs.disconnect();
}

function clip() {
  return obs
    .call("SaveReplayBuffer")
    .then(() => console.log("clip saved"))
    .catch((e) => {
      console.log("failed to save replay buffer");
      console.log(e);
    });
}

export default {
  connect,
  disconnect,
  clip,
};

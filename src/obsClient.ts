import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";

let obsStreamCanna = new OBSWebSocket();
let obsGameCanna = new OBSWebSocket();
let obsTeazy = new OBSWebSocket();

function connectCanna() {
  console.log("OBS - Canna - connecting");
  return Promise.all([
    obsGameCanna
      .connect(
        `ws://${constants.obs.CANNA_GAME_SERVER}:4455`,
        constants.obs.CANNA_GAME_SERVER_PASSWORD
      )
      .then(() => {
        console.log("OBS - Canna Game - connected");
      })
      .catch((e) => {
        console.log("OBS - Canna Game - not connected");
        throw e;
      }),
    obsStreamCanna
      .connect(
        `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
        constants.obs.CANNA_STREAM_SERVER_PASSWORD
      )
      .then(() => {
        console.log("OBS - Canna Stream - connected");
        return obsStreamCanna
          .call("GetReplayBufferStatus")
          .then((response) => {
            if (!response.outputActive) {
              return obsStreamCanna.call("StartReplayBuffer").then(() => {
                console.log("OBS - Canna Stream - replay buffer started");
              });
            }
          })
          .catch((e) => {
            console.log("OBS - Canna Stream - replay buffer not started");
            throw e;
          });
      })
      .catch((e) => {
        console.log("OBS - Canna Stream - not connected");
        throw e;
      }),
  ]);
}

function connectTeazy() {
  console.log("OBS - Teazy - connecting");
  return obsTeazy
    .connect(
      `ws://${constants.obs.TEAZY_SERVER}:4455`,
      constants.obs.TEAZY_SERVER_PASSWORD
    )
    .then(() => {
      console.log("OBS - Teazy - connected");
      return obsTeazy
        .call("GetReplayBufferStatus")
        .then((response) => {
          if (!response.outputActive) {
            return obsTeazy.call("StartReplayBuffer").then(() => {
              console.log("OBS - Teazy - replay buffer started");
            });
          }
        })
        .catch((e) => {
          console.log("OBS - Teazy - replay buffer not started");
          throw e;
        });
    })
    .catch((e) => {
      console.log("OBS - Teazy - not connected");
      throw e;
    });
}

function disconnectCanna() {
  console.log("OBS - Canna - disconnecting");
  return Promise.all([
    obsGameCanna.disconnect(),
    obsStreamCanna
      .call("StopReplayBuffer")
      .finally(() => obsStreamCanna.disconnect()),
  ]).catch(() => {
    console.log("OBS - Canna - disconnect failed");
  });
}

function disconnectTeazy() {
  console.log("OBS - Teazy - disconnecting");
  return obsTeazy
    .call("StopReplayBuffer")
    .finally(() => obsTeazy.disconnect())
    .catch(() => {
      console.log("OBS - Teazy - disconnect failed");
    });
}

function clipCanna() {
  console.log("OBS - Canna - clipping");
  return Promise.all([
    obsGameCanna.reidentify({}).catch((e) => {
      console.log("OBS - Canna Game - save replay audio failed");
      throw e;
    }),
    obsStreamCanna.call("SaveReplayBuffer").catch((e) => {
      console.log("OBS - Canna Stream - save replay failed");
      throw e;
    }),
  ]).then(() => console.log("OBS - Canna - saved replay"));
}

function clipTeazy() {
  console.log("OBS - Teazy - clipping");
  return obsTeazy
    .call("SaveReplayBuffer")
    .then(() => {
      console.log("OBS - Teazy - saved replay");
    })
    .catch((e) => {
      console.log("OBS - Teazy - save replay failed");
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

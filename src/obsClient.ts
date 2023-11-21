import OBSWebSocket from "obs-websocket-js";
import constants from "./constants";
import winston from "winston";

let obsStreamCanna = new OBSWebSocket();
let obsGameCanna = new OBSWebSocket();

function connectCanna() {
  winston.info("OBS - Canna - connecting");
  return Promise.all([
    obsGameCanna
      .connect(
        `ws://${constants.obs.CANNA_GAME_SERVER}:4455`,
        constants.obs.CANNA_GAME_SERVER_PASSWORD
      )
      .then(() => {
        winston.info("OBS - Canna Game - connected");
      })
      .catch((e) => {
        winston.error("OBS - Canna Game - not connected");
        throw e;
      }),
    obsStreamCanna
      .connect(
        `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
        constants.obs.CANNA_STREAM_SERVER_PASSWORD
      )
      .then(() => {
        winston.info("OBS - Canna Stream - connected");
        return obsStreamCanna
          .call("GetReplayBufferStatus")
          .then((response) => {
            if (!response.outputActive) {
              return obsStreamCanna.call("StartReplayBuffer").then(() => {
                winston.info("OBS - Canna Stream - replay buffer started");
              });
            }
          })
          .catch((e) => {
            winston.error("OBS - Canna Stream - replay buffer not started");
            throw e;
          });
      })
      .catch((e) => {
        winston.error("OBS - Canna Stream - not connected");
        throw e;
      }),
  ]);
}

function disconnectCanna() {
  winston.info("OBS - Canna - disconnecting");
  return Promise.all([
    obsGameCanna.disconnect(),
    obsStreamCanna
      .call("StopReplayBuffer")
      .finally(() => obsStreamCanna.disconnect()),
  ]).catch(() => {
    winston.error("OBS - Canna - disconnect failed");
  });
}

function clipCanna() {
  winston.info("OBS - Canna - clipping");
  return Promise.all([
    obsGameCanna.reidentify({}).catch((e) => {
      winston.error("OBS - Canna Game - save replay audio failed");
      throw e;
    }),
    obsStreamCanna.call("SaveReplayBuffer").catch((e) => {
      winston.error("OBS - Canna Stream - save replay failed");
      throw e;
    }),
  ]).then(() => winston.info("OBS - Canna - saved replay"));
}

export default {
  connectCanna,
  disconnectCanna,
  clipCanna,
};

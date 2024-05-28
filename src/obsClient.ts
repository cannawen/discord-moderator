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
        winston.error(e);
        throw e;
      }),
    obsStreamCanna
      .connect(
        `ws://${constants.obs.CANNA_STREAM_SERVER}:4455`,
        constants.obs.CANNA_STREAM_SERVER_PASSWORD
      )
      .then(() => {
        winston.info("OBS - Canna Stream - connected");
      })
      .catch((e) => {
        winston.error("OBS - Canna Stream - not connected");
        winston.error(e);
        throw e;
      }),
  ]);
}

function disconnectCanna() {
  winston.info("OBS - Canna - disconnecting");
  return Promise.all([
    obsGameCanna.disconnect(),
    obsStreamCanna.disconnect(),
  ]).catch(() => {
    winston.error("OBS - Canna - disconnect failed");
  });
}

function clipCanna() {
  winston.info("OBS - Canna - clipping");
  return Promise.all([
    obsGameCanna
      .reidentify({})
      .catch((e) => {
        winston.error("OBS - Canna Game - OBS not connected");
        throw e;
      })
      .then(() => {
        obsGameCanna.call("SaveReplayBuffer").catch((e) => {
          winston.error("OBS - Canna Game - save audio failed");
          throw e;
        });
      }),
    obsStreamCanna
      .reidentify({})
      .catch((e) => {
        winston.error("OBS - Canna Stream - OBS not connected");
        throw e;
      })
      .then(() => {
        obsStreamCanna.call("SaveReplayBuffer").catch((e) => {
          winston.error("OBS - Canna Stream - save replay failed");
          throw e;
        });
      }),
  ]).then(() => winston.info("OBS - Canna - saved replay"));
}

function reidentifyCanna() {
  return Promise.all([
    obsGameCanna.reidentify({}).catch((e) => {
      winston.error("OBS - Canna Game - not connected");
      throw e;
    }),
    obsStreamCanna.reidentify({}).catch((e) => {
      winston.error("OBS - Canna Stream - not connected");
      throw e;
    }),
  ]);
}

function isCannaStreaming(): Promise<boolean> {
  return obsStreamCanna
    .call("GetStreamStatus")
    .then((status) => status.outputActive);
}

function streamCannaStart() {
  return reidentifyCanna()
    .then(isCannaStreaming)
    .then((outputActive) =>
      outputActive
        ? new Error("OBS - Already streaming")
        : obsStreamCanna.call("StartStream")
    );
}

function streamCannaStop() {
  return reidentifyCanna()
    .then(isCannaStreaming)
    .then((outputActive) =>
      outputActive
        ? obsStreamCanna.call("StopStream")
        : new Error("OBS - Not currently streaming")
    );
}

obsStreamCanna.on("StreamStateChanged", ({ outputActive, outputState }) => {});

export default {
  connectCanna,
  disconnectCanna,
  clipCanna,
  reidentifyCanna,
  streamCannaStart,
  streamCannaStop,
};

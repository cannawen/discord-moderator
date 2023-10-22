import winston, { LogEntry } from "winston";
import Transport from "winston-transport";
import constants from "./constants";
import { findTextChannel } from "./helpers";

class DiscordTransport extends Transport {
  log(info: LogEntry, callback: any) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;
    findTextChannel(constants.channelIds.LOGS).send(`[${level}] ${message}`);

    callback();
  }
}

winston.add(new DiscordTransport({ level: "info" }));
winston.add(
  new winston.transports.Console({
    level: "verbose",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

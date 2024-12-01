import winston, { LogEntry, format } from "winston";
import Transport from "winston-transport";
import constants from "./constants";
import { findTextChannel } from "./helpers";

class DiscordInfoLogTransport extends Transport {
  log(info: LogEntry, callback: any) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;
    findTextChannel(constants.discord.channelIds.LOGS).send(`[${level}] ${message}`);

    callback();
  }
}

class DiscordVerboseCannaLogTransport extends Transport {
  log(info: LogEntry, callback: any) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;
    findTextChannel(constants.discord.channelIds.CANNA_LOGS).send(`${message}`);

    callback();
  }
}

const LEVEL = Symbol.for("level");

function filterOnly(level: string) {
  return format((info) => {
    if (info[LEVEL] === level) {
      return info;
    }
    return false;
  })();
}

winston.add(new DiscordInfoLogTransport({ level: "info" }));
winston.add(
  new DiscordVerboseCannaLogTransport({
    level: "verbose",
    format: filterOnly("verbose"),
  })
);
winston.add(
  new winston.transports.Console({
    level: "silly",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

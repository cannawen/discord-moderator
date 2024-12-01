import logger from "./logger";
import { initDiscord } from "./discordClient";
import winston from "winston";

logger.setup();
initDiscord();

function handleShutdown() {
    winston.error("App shutdown signal received");
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

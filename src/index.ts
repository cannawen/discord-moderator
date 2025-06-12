import constants from "./constants";
import { findMember } from "./helpers";
import { getVoiceConnection } from "@discordjs/voice";
import { initDiscord } from "./discordClient";
import logger from "./logger";
import winston from "winston";

logger.setup();
initDiscord();

let isShuttingDown = false;

function handleShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

    winston.info("Received shutdown signal, shutting down gracefully...");
    const connection = getVoiceConnection(constants.discord.guildIds.BEST_DOTA);
    if (connection) {
        connection.destroy();
    }
    process.exit(0);
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
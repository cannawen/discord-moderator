require("dotenv").config();

export default {
  discord: {
    APPLICATION_ID: process.env.DISCORD_APPLICATION_ID!,
    PRIVATE_TOKEN: process.env.DISCORD_PRIVATE_TOKEN!,
  },
  guildIds: {
    BEST_DOTA: process.env.GUILD_ID_BEST_DOTA!,
  },
  channelNames: {
    DOTA_2: "mode: chaos",
    HOME: "Home <3",
    GENERAL: "General",
    SECRETS: "mode: focus",
    REAL_SECRETS: "mode: hiding",
    TIMEOUT: "mode: shh",
  },
  channelIds: {
    DOTA_2: process.env.CHANNEL_ID_DOTA_2!,
    GENERAL: process.env.CHANNEL_ID_GENERAL!,
    SECRETS: process.env.CHANNEL_ID_SECRETS!,
    REAL_SECRETS: process.env.CHANNEL_ID_REAL_SECRETS!,
    TIMEOUT: process.env.CHANNEL_ID_TIMEOUT!,
    CLIPS: process.env.CHANNEL_ID_CLIPS!,
    LOGS: process.env.CHANNEL_ID_LOGS!,
    CANNA_LOGS: process.env.CHANNEL_ID_CANNA_LOGS!,
    LOBBY: process.env.CHANNEL_ID_LOBBY!,
    RADIANT: process.env.CHANNEL_ID_RADIANT!,
    DIRE: process.env.CHANNEL_ID_DIRE!,
  },
  roleIds: {
    EVERYONE_EXCEPT_DRABZ: process.env.ROLE_ID_EVERYONE_EXCEPT_DRABZ!,
  },
  memberIds: {
    CANNA: process.env.MEMBER_ID_CANNA!,
    CANNA_BOT: process.env.MEMBER_ID_CANNA_BOT!,
    DOTA_COACH: process.env.MEMBER_ID_DOTA_COACH!,
    DRABZ: process.env.MEMBER_ID_DRABZ!,
    JPROPERLY: process.env.MEMBER_ID_JPROPERLY!,
    TARGET: process.env.MEMBER_ID_TARGET!,
    TEAZY: process.env.MEMBER_ID_TEAZY!,
    WRABBIT: process.env.MEMBER_ID_WRABBIT!,
  },
  obs: {
    CANNA_STREAM_SERVER: process.env.OBS_SERVER_CANNA_STREAM!,
    CANNA_STREAM_SERVER_PASSWORD: process.env.OBS_SERVER_CANNA_STREAM_PASSWORD!,
    CANNA_GAME_SERVER: process.env.OBS_SERVER_CANNA_GAME!,
    CANNA_GAME_SERVER_PASSWORD: process.env.OBS_SERVER_CANNA_GAME_PASSWORD!,
  },
};

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
    HOME: "Home <3",

    GENERAL: "General",
    CHAOS: "mode: chaos",
    FOCUS: "mode: focus",
    STREAMING: "mode: streaming",
    HIDING: "mode: hiding",
    SHH: "mode: shh",

    LOBBY: "Lobby",
    RADIANT: "Radiant",
    DIRE: "Dire",
  },
  channelIds: {
    GENERAL: process.env.CHANNEL_ID_GENERAL!,
    CHAOS: process.env.CHANNEL_ID_CHAOS!,
    FOCUS: process.env.CHANNEL_ID_FOCUS!,
    STREAMING: process.env.CHANNEL_ID_STREAMING!,
    HIDING: process.env.CHANNEL_ID_HIDING!,
    SHH: process.env.CHANNEL_ID_SHH!,

    LOBBY: process.env.CHANNEL_ID_LOBBY!,
    RADIANT: process.env.CHANNEL_ID_RADIANT!,
    DIRE: process.env.CHANNEL_ID_DIRE!,

    CLIPS: process.env.CHANNEL_ID_CLIPS!,
    LOGS: process.env.CHANNEL_ID_LOGS!,
    CANNA_LOGS: process.env.CHANNEL_ID_CANNA_LOGS!,
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
  studentIds: {
    CANNA: process.env.STUDENT_ID_CANNA!,
  },
  obs: {
    CANNA_STREAM_SERVER: process.env.OBS_SERVER_CANNA_STREAM!,
    CANNA_STREAM_SERVER_PASSWORD: process.env.OBS_SERVER_CANNA_STREAM_PASSWORD!,
    CANNA_GAME_SERVER: process.env.OBS_SERVER_CANNA_GAME!,
    CANNA_GAME_SERVER_PASSWORD: process.env.OBS_SERVER_CANNA_GAME_PASSWORD!,
  },
  openAi: {
    CHATGPT_SECRET_KEY: process.env.CHATGPT_SECRET_KEY,
  },
};

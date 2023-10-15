require("dotenv").config();

export default {
  discord: {
    APPLICATION_ID: process.env.DISCORD_APPLICATION_ID!,
    PRIVATE_TOKEN: process.env.DISCORD_PRIVATE_TOKEN!,
  },
  guildIds: {
    BEST_DOTA: process.env.GUILD_ID_BEST_DOTA!,
  },
  channelIds: {
    THE_CHURCH_OF_RICO: process.env.CHANNEL_ID_THE_CHURCH_OF_RICO!,
    DOTA_2: process.env.CHANNEL_ID_DOTA_2!,
    GENERAL: process.env.CHANNEL_ID_GENERAL!,
    SECRETS: process.env.CHANNEL_ID_SECRETS!,
    LFS: process.env.CHANNEL_ID_LFS!,
    LOBBY: process.env.CHANNEL_ID_LOBBY!,
    CLIPS: process.env.CHANNEL_ID_CLIPS!,
    RADIANT: process.env.CHANNEL_ID_RADIANT!,
    DIRE: process.env.CHANNEL_ID_DIRE!,
  },
  roleIds: {
    EVERYONE_EXCEPT_DRABZ: process.env.ROLE_ID_EVERYONE_EXCEPT_DRABZ!,
    LFS: process.env.ROLE_ID_LFS!,
  },
  memberIds: {
    CANNA: process.env.MEMBER_ID_CANNA!,
    CANNA_BOT: process.env.MEMBER_ID_CANNA_BOT!,
    DOTA_COACH: process.env.MEMBER_ID_DOTA_COACH!,
    DRABZ: process.env.MEMBER_ID_DRABZ!,
    JPROPERLY: process.env.MEMBER_ID_JPROPERLY!,
    RICO: process.env.MEMBER_ID_RICO!,
  },
  messageIds: {
    LFS_REACT_MESSAGE: process.env.MESSAGE_ID_LFS_REACT!,
  },
  obs: {
    CANNA_STREAM_SERVER: process.env.OBS_SERVER_CANNA_STREAM!,
    CANNA_STREAM_SERVER_PASSWORD: process.env.OBS_SERVER_CANNA_STREAM_PASSWORD!,
  },
};

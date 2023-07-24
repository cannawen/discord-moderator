require("dotenv").config();

export default {
  discord: {
    PRIVATE_TOKEN: process.env.DISCORD_PRIVATE_TOKEN!,
  },
  guildIds: {
    BEST_DOTA: process.env.GUILD_ID_BEST_DOTA!,
  },
  channelIds: {
    THE_CHURCH_OF_RICO: process.env.CHANNEL_ID_THE_CHURCH_OF_RICO!,
    DOTA_2: process.env.CHANNEL_ID_DOTA_2!,
    GENERAL: process.env.CHANNEL_ID_GENERAL!,
    LOBBY: process.env.CHANNEL_ID_LOBBY!,
    RADIANT: process.env.CHANNEL_ID_RADIANT!,
    DIRE: process.env.CHANNEL_ID_DIRE!,
  },
  roleIds: {
    EVERYONE_EXCEPT_DRABZ: process.env.ROLE_ID_EVERYONE_EXCEPT_DRABZ!,
  },
  memberIds: {
    CANNA: process.env.MEMBER_ID_CANNA!,
    DOTA_COACH: process.env.MEMBER_ID_DOTA_COACH!,
    DRABZ: process.env.MEMBER_ID_DRABZ!,
    RICO: process.env.MEMBER_ID_RICO!,
  },
};

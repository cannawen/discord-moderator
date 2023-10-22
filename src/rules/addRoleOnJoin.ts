import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "assign everybody-except-drabz role to new members",
  start: () => {
    client.on(Events.GuildMemberAdd, (member) => {
      winston.info(
        `Role - everybody-except-drabz - role added for ${member.displayName}`
      );
      member.roles.add(constants.roleIds.EVERYONE_EXCEPT_DRABZ);
    });
  },
});

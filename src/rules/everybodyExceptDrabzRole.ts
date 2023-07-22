import constants from "../constants";
import Rule from "../Rule";

export default new Rule({
  description: "assign everybody-except-drabz role to new users",
  registerClient: (client) => {
    client.on("guildMemberAdd", (member) => {
      member.roles.add(constants.roleIds.EVERYONE_EXCEPT_DRABZ);
    });
  },
});

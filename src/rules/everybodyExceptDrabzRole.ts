import constants from "../constants";
import Rule from "../Rule";

// assign everybody-except-drabz role to new users
export default ((client) => {
  client.on("guildMemberAdd", (member) => {
    member.roles.add(constants.roleIds.EVERYONE_EXCEPT_DRABZ);
  });
}) as Rule;

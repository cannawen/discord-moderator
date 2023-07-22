import Rule from "../Rule";

export default new Rule({
  description: "assign everybody-except-drabz role to new users",
  registerClient: (client) => {
    client.on("guildMemberAdd", (member) => {
      member.roles.add(process.env.ROLE_ID_EVERYBODY_EXCEPT_DRABZ!);
    });
  },
});

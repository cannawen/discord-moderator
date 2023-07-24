import cron from "node-cron";
import Rule from "../Rule";
import constants from "../constants";

export default new Rule({
  description: "drabz",
  start: (_, guild) => {
    const drabzRole = guild.roles.cache.find(
      (r) => r.id === constants.roleIds.DRABZ
    );

    cron.schedule("0 0 * * SAT", () => {
      drabzRole?.edit({ name: "weekend drabz" });
    });
    cron.schedule("0 0 * * MON", () => {
      drabzRole?.edit({ name: "weekday drabz" });
    });
  },
});

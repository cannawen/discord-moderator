import constants from "../constants";
import cron from "node-cron";
import { findRole } from "../helpers";
import Rule from "../Rule";

export default new Rule({
  description: "drabz",
  start: () => {
    const drabzRole = findRole(constants.roleIds.DRABZ);

    cron.schedule("0 0 * * SAT", () => {
      drabzRole.edit({ name: "weekend drabz" });
    });
    cron.schedule("0 0 * * MON", () => {
      drabzRole.edit({ name: "weekday drabz" });
    });
  },
});

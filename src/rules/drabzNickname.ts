import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Rule from "../Rule";

export default new Rule({
  description: "drabz",
  start: () => {
    const drabz = findMember(constants.memberIds.DRABZ);

    cron.schedule("0 0 * * SAT", () => {
      drabz.edit({ nick: "Drabz (weekend)" });
    });
    cron.schedule("0 0 * * MON", () => {
      drabz.edit({ nick: "Drabz (weekday)" });
    });
    cron.schedule("0 0 * * TUE", () => {
      drabz.edit({ nick: "Drabz (weekday)" });
    });
  },
});

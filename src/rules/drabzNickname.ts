import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Rule from "../Rule";

const nightAnchor = new Date(2023, 6, 3, 0, 0, 0, 0);
const afternoonAnchor = new Date(2023, 6, 17, 0, 0, 0, 0);
const dayAnchor = new Date(2023, 6, 31, 0, 0, 0, 0);

export default new Rule({
  description: "drabz",
  tick: () => {
    const drabz = findMember(constants.memberIds.DRABZ);
    const day = new Date().getDay();
    if (day === 6 || day === 0) {
      drabz.edit({ nick: "Drabz (weekend)" });
    }
    if (day !== 6 && day !== 0) {
      drabz.edit({ nick: "Drabz (weekday)" });
    }
  },
});

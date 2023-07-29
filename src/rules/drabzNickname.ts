import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Holidays from "date-holidays";
import Rule from "../Rule";

const nightAnchor = new Date(2023, 6, 3, 0, 0, 0, 0).getTime();
const sixWeeksInMs = 6 * 7 * 24 * 60 * 60 * 1000;

const holidays = new Holidays("CA", "AB");

function drabzString(date: Date) {
  const isHoliday = holidays.isHoliday(date);
  if (isHoliday instanceof Array) {
    if (isHoliday.reduce((memo, h) => h.type === "public" || memo, false)) {
      return "Drabz (holiday)";
    }
  }

  const leftovers = (date.getTime() - nightAnchor) % sixWeeksInMs;
  if (leftovers < sixWeeksInMs / 3) {
    return "Drabz (night)";
  }
  if (leftovers < (2 * sixWeeksInMs) / 3) {
    return "Drabz (afternoon)";
  }

  return "Drabz (day)";
}

export default new Rule({
  description:
    "edit drabz nickname to reflect his work schedule (night-afternoon-day 6 week cycle anchored July 3rd, 2023)",
  start: () => {
    cron.schedule("0 0 * * *", () => {
      const drabz = findMember(constants.memberIds.DRABZ);
      const now = new Date();

      let drabzNick: string;
      if (now.getDay() === 6 || now.getDay() === 0) {
        drabzNick = "Drabz (weekend)";
      } else {
        drabzNick = drabzString(now);
      }

      if (drabz.nickname !== drabzNick) {
        drabz.edit({ nick: drabzNick });
      }
    });
  },
});

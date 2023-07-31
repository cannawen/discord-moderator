import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Holidays from "date-holidays";
import Rule from "../Rule";

const NIGHT_ANCHOR = new Date(2023, 6, 3, 0, 0, 0, 0);
const SIX_WEEKS_IN_MS = 6 * 7 * 24 * 60 * 60 * 1000;

function isWeekend(date: Date) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function isHoliday(date: Date) {
  const holidaysOnDate = new Holidays("CA", "AB").isHoliday(date);
  if (holidaysOnDate instanceof Array) {
    return holidaysOnDate.reduce(
      (memo, h) => h.type === "public" || memo,
      false
    );
  }
  return false;
}

function msIntoCycle(date: Date) {
  return (date.getTime() - NIGHT_ANCHOR.getTime()) % SIX_WEEKS_IN_MS;
}

function isNightShift(date: Date) {
  return msIntoCycle(date) < SIX_WEEKS_IN_MS / 3;
}

function isAfternoonShift(date: Date) {
  return (
    msIntoCycle(date) >= SIX_WEEKS_IN_MS / 3 &&
    msIntoCycle(date) < (2 * SIX_WEEKS_IN_MS) / 3
  );
}

function isDayShift(date: Date) {
  return msIntoCycle(date) >= (2 * SIX_WEEKS_IN_MS) / 3;
}

function drabzNicknameString(date: Date) {
  if (isWeekend(date)) {
    return "Drabz (weekend)";
  }
  if (isHoliday(date)) {
    return "Drabz (holiday)";
  }
  if (isNightShift(date)) {
    return "Drabz (night)";
  }
  if (isAfternoonShift(date)) {
    return "Drabz (afternoon)";
  }
  if (isDayShift(date)) {
    return "Drabz (day)";
  }
  return "Drabz";
}

export default new Rule({
  description:
    "edit drabz nickname to reflect his work schedule (night-afternoon-day 6 week cycle anchored July 3rd, 2023)",
  start: () => {
    cron.schedule("0 0 * * *", () => {
      const drabz = findMember(constants.memberIds.DRABZ);
      const drabzNick = drabzNicknameString(new Date());

      if (drabz.nickname !== drabzNick) {
        drabz.edit({ nick: drabzNick });
      }
    });
  },
});

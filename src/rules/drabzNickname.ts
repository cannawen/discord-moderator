import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Holidays from "date-holidays";
import Rule from "../Rule";
import winston from "winston";

const NIGHT_ANCHOR = new Date(2023, 10, 20, 0, 0, 0, 0);
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

function percentageInto6WeekCycle(date: Date) {
  return (
    ((date.getTime() - NIGHT_ANCHOR.getTime()) % SIX_WEEKS_IN_MS) /
    SIX_WEEKS_IN_MS
  );
}

function isNightShift(date: Date) {
  return percentageInto6WeekCycle(date) < 1 / 3;
}

function isAfternoonShift(date: Date) {
  return (
    percentageInto6WeekCycle(date) >= 1 / 3 &&
    percentageInto6WeekCycle(date) < 2 / 3
  );
}

function isDayShift(date: Date) {
  return percentageInto6WeekCycle(date) >= 2 / 3;
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
    "edit drabz nickname to reflect his work schedule (night-afternoon-day 6 week cycle anchored November 20rd, 2023)",
  start: () => {
    cron.schedule("0 0 * * *", () => {
      const today = new Date();

      const drabz = findMember(constants.memberIds.DRABZ);
      const drabzNewNickname = drabzNicknameString(today);

      if (drabz.nickname !== drabzNewNickname) {
        winston.info(
          `Nickname - update ${drabz.nickname} to ${drabzNewNickname}`
        );
        drabz.edit({ nick: drabzNewNickname });
      }
    });
  },
});

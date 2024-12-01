import constants from "../constants";
import cron from "node-cron";
import { findMember } from "../helpers";
import Holidays from "date-holidays";
import Rule from "../Rule";
import winston from "winston";

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

function drabzNicknameString(date: Date) {
  if (isWeekend(date)) {
    return "Drabz (weekend)";
  }
  if (isHoliday(date)) {
    return "Drabz (holiday)";
  }
  return "Drabz (weekday)";
}

export default new Rule({
  description: "edit drabz nickname to reflect weekday/weekend/holiday",
  start: () => {
    cron.schedule("0 0 * * *", () => {
      const today = new Date();

      const drabz = findMember(constants.discord.memberIds.DRABZ);
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

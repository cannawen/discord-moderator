import constants from "../constants";
import { findMember } from "../helpers";
import Rule from "../Rule";

const nightAnchor = new Date(2023, 6, 3, 0, 0, 0, 0).getTime();
const afternoonAnchor = new Date(2023, 6, 17, 0, 0, 0, 0).getTime();
const dayAnchor = new Date(2023, 6, 31, 0, 0, 0, 0).getTime();

const sixWeeksInMs = 6 * 7 * 24 * 60 * 60 * 1000;

function drabzString(date: Date) {
  const leftovers = (date.getTime() - nightAnchor) % sixWeeksInMs;
  if (leftovers < leftovers / 3) {
    return "Drabz (night)";
  }
  if (leftovers < (2 * leftovers) / 3) {
    return "Drabz (afternoon)";
  }

  return "Drabz (day)";
}

export default new Rule({
  description: "drabz",
  tick: () => {
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
  },
});

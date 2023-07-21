import { findVoiceChannel, foundUserInChannel, moveAllUsers } from "../helpers";
import cron from "node-cron";
import Rule from "../Rule";

export default new Rule((guild) => {
  const churchOfRico = findVoiceChannel(
    guild,
    process.env.CHANNEL_ID_CHURCH_OF_RICO!
  );
  const dota2 = findVoiceChannel(guild, process.env.CHANNEL_ID_DOTA_2!);
  const general = findVoiceChannel(guild, process.env.CHANNEL_ID_GENERAL!);

  cron.schedule("*/2 * * * * *", () => {
    if (foundUserInChannel(process.env.USER_ID_RICO!, dota2)) {
      moveAllUsers(dota2, churchOfRico);
    } else if (foundUserInChannel(process.env.USER_ID_RICO!, general)) {
      moveAllUsers(general, churchOfRico);
    }
  });
});

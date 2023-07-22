import { Client, Events, Guild } from "discord.js";
import constants from "./constants";
import cron from "node-cron";
import fs from "fs";
import { getVoiceConnection } from "@discordjs/voice";
import path from "path";
import Rule from "./Rule";
import stt from "./speechToText";

const client = new Client({ intents: [131071] });

function getRules(): Rule[] {
  const dirPath = path.join(__dirname, "rules");
  return (
    fs
      .readdirSync(dirPath)
      // .js and because it gets transpiled in /build directory
      // .ts and because during testing, it stays in the /src directory
      // TODO Kinda sketch that we need the || for tests only ...
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
      .map((file) => path.join(dirPath, file))
      // eslint-disable-next-line global-require
      .map((filePath) => require(filePath))
      // register modules that return a `Rule` or array of `Rule`s
      .reduce((memo: Rule[], module) => {
        const rulesArray = (
          Array.isArray(module.default) ? module.default : [module.default]
        ).filter((r: any) => r instanceof Rule);
        return memo.concat(rulesArray);
      }, [])
  );
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = client.guilds.cache.find(
    (g) => g.id === constants.guildIds.BEST_DOTA
  )!;

  const rules = getRules();

  rules.filter((r) => r.start).map((r) => r.start!(guild, client));

  cron.schedule("*/1 * * * * *", () => {
    rules.filter((r) => r.tick).map((r) => r.tick!(guild, client));
  });

  const connection = getVoiceConnection(guild.id);
  connection?.receiver.speaking.on("start", (userId) => {
    if (userId === constants.userIds.CANNA) {
      stt.transcribe(connection.receiver, userId).then((utterance) => {
        if (!utterance) return;

        console.log(utterance);

        rules
          .filter((r) => r.utterance)
          .map((r) => r.utterance!(guild, utterance));
      });
    }
  });
});

client.login(constants.discord.PRIVATE_TOKEN);

import { Client, Events } from "discord.js";
import constants from "./constants";
import cron from "node-cron";
import client from "./discordClient";
import fs from "fs";
import { getVoiceConnection } from "@discordjs/voice";
import path from "path";
import Rule from "./Rule";
import stt from "./speechToText";

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

  rules.filter((r) => r.start).map((r) => r.start!(client, guild));

  // this flag here is very sketchy - there must be a better way to do this
  let listening = false;
  cron.schedule("*/1 * * * * *", () => {
    rules.filter((r) => r.tick).map((r) => r.tick!(guild));

    const connection = getVoiceConnection(guild.id);
    if (connection && !listening) {
      listening = true;
      connection?.receiver.speaking.on("start", (memberId) => {
        stt
          .transcribe(connection.receiver, memberId)
          .then((utterance) => {
            if (!utterance) return;

            if (memberId === constants.memberIds.CANNA) {
              console.log(utterance);
            }

            rules
              .filter((r) => r.utterance)
              .map((r) => r.utterance!(guild, utterance, memberId));
          })
          .catch(() => {});
      });
    }
    if (!connection && listening) {
      listening = false;
    }
  });
});

client.login(constants.discord.PRIVATE_TOKEN);

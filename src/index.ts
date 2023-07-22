require("dotenv").config();
import { Client, Events, Guild } from "discord.js";
import fs from "fs";
import path from "path";
import Rule from "./Rule";

const client = new Client({ intents: [131071] });

function registerRules(guild: Guild) {
  const dirPath = path.join(__dirname, "rules");
  fs.readdirSync(dirPath)
    // .js and because it gets transpiled in /build directory
    // .ts and because during testing, it stays in the /src directory
    // TODO Kinda sketch that we need the || for tests only ...
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
    .map((file) => path.join(dirPath, file))
    // eslint-disable-next-line global-require
    .map((filePath) => require(filePath))
    // register modules that return a `Rule` or array of `Rule`s
    .forEach((module) => {
      const rulesArray = Array.isArray(module.default)
        ? module.default
        : [module.default];
      rulesArray
        .filter((m: unknown) => m instanceof Rule)
        .forEach((rule: Rule) => {
          if (rule.registerClient) {
            rule.registerClient(client);
          }
          if (rule.registerGuild) {
            rule.registerGuild(guild);
          }
        });
    });
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = client.guilds.cache.find(
    (g) => g.id === process.env.BEST_DOTA_GUILD_ID
  )!;

  registerRules(guild);
});

client.login(process.env.DISCORD_PRIVATE_TOKEN);

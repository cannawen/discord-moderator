import client from "./discordClient";
import constants from "./constants";
import cron from "node-cron";
import { Events, REST, Routes, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import { getVoiceConnection } from "@discordjs/voice";
import path from "path";
import Rule from "./Rule";
import stt from "./speechToText";
import { findMember } from "./helpers";

let botEnabled = true;

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

  rules.filter((r) => r.start).map((r) => r.start!());

  // this flag here is very sketchy - there must be a better way to do this
  let listening = false;
  cron.schedule("*/1 * * * * *", () => {
    if (!botEnabled) return;

    rules.filter((r) => r.tick).map((r) => r.tick!());

    const connection = getVoiceConnection(guild.id);
    if (connection && !listening) {
      listening = true;
      connection?.receiver.speaking.on("start", (memberId) => {
        if (!botEnabled) return;

        stt
          .transcribe(connection.receiver, memberId)
          .then((utterance) => {
            if (!utterance) return;

            if (memberId === constants.memberIds.CANNA) {
              console.log(utterance);
            }

            rules
              .filter((r) => r.utterance)
              .map((r) => r.utterance!(utterance, memberId));
          })
          .catch(() => {});
      });
    }
    if (!connection && listening) {
      listening = false;
    }
  });
});

// Register slash commands
(async () => {
  try {
    await new REST()
      .setToken(constants.discord.PRIVATE_TOKEN)
      .put(
        Routes.applicationGuildCommands(
          constants.discord.APPLICATION_ID,
          constants.guildIds.BEST_DOTA
        ),
        {
          body: [
            new SlashCommandBuilder()
              .setName("disable")
              .setDescription("Disable the bot for 2 hours"),

            new SlashCommandBuilder()
              .setName("enable")
              .setDescription("Enable the bot"),
          ],
        }
      );
  } catch (error) {
    console.error(error);
  }
})();

// Handle slash commands
client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  switch (command) {
    case "disable":
      botEnabled = false;
      findMember(constants.memberIds.CANNA_BOT).voice.disconnect();
      setTimeout(() => {
        botEnabled = true;
      }, 2 * 60 * 1000);
      interaction.reply({
        content: "canna-bot disabled for 2 hours",
        ephemeral: true,
      });
      break;
    case "enable":
      botEnabled = true;
      interaction.reply({
        content: "canna-bot enabled",
        ephemeral: true,
      });
      break;

    default:
      break;
  }
});

client.login(constants.discord.PRIVATE_TOKEN);

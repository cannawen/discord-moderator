import "./setupLogger";
import {
  Events,
  GuildMember,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { findMember, findTextChannel } from "./helpers";
import constants from "./constants";
import cron from "node-cron";
import discord from "./discordClient";
import fs from "fs";
import { getVoiceConnection } from "@discordjs/voice";
import path from "path";
import Rule from "./Rule";
import stt from "./speechToText";
import winston from "winston";

// find all rules
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

const rules = getRules();

// let each rule know the app has started
discord.once(Events.ClientReady, (c) => {
  winston.info(`Ready! Logged in as ${c.user.tag}`);

  rules.filter((r) => r.start).map((r) => r.start!());
});

// this flag here is very sketchy - there must be a better way to do this
let listening = false;
// poll for voice connection so we can capture voice to speech-to-text
cron.schedule("*/1 * * * * *", () => {
  const connection = getVoiceConnection(constants.guildIds.BEST_DOTA);
  if (connection && !listening) {
    listening = true;
    connection?.receiver.speaking.on("start", (memberId) => {
      stt
        .transcribe(connection.receiver, memberId)
        .then((utterance) => {
          if (!utterance) return;

          if (memberId === constants.memberIds.CANNA) {
            winston.verbose(utterance);
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
              .setName("disconnect")
              .setDescription("Force the bot to disconnect"),
            new SlashCommandBuilder()
              .setName("clip")
              .addStringOption((option) =>
                option.setName("title").setDescription("title of the thread")
              )
              .addStringOption((option) =>
                option.setName("comment").setDescription("comment about clip")
              )
              .addStringOption((option) =>
                option.setName("link").setDescription("link to clip")
              )
              .addAttachmentOption((option) =>
                option
                  .setName("file")
                  .setDescription(
                    "attach clip as a file (beta feature - may not work; must be < 25mb)"
                  )
              )
              .addStringOption((option) =>
                option.setName("matchid").setDescription("match id")
              )
              .setDescription("Post a clip"),
          ],
        }
      );
  } catch (error) {
    console.error(error);
  }
})();

// Handle slash commands
discord.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  switch (command) {
    case "disconnect":
      findMember(constants.memberIds.CANNA_BOT).voice.disconnect();
      interaction.reply({
        content: "canna-bot disconnected",
        ephemeral: true,
      });
      break;
    case "clip":
      {
        const member = interaction.member as GuildMember;

        const title = interaction.options.getString("title");
        const comment = interaction.options.getString("comment");
        const link = interaction.options.getString("link");
        const attachment = interaction.options.getAttachment("file");
        const matchId = interaction.options.getString("matchid");

        let messageText = `<@${interaction.user.id}>:`;
        if (comment) {
          messageText += ` "${comment}"`;
        }
        if (link) {
          messageText += `\n\n${link}`;
        }
        if (matchId) {
          messageText += ` (match id ${matchId})`;
        }

        let messagePayload;

        if (attachment) {
          messagePayload = {
            content: messageText,
            files: [{ attachment: attachment.url }],
          };
        } else {
          messagePayload = messageText;
        }

        findTextChannel(constants.channelIds.CLIPS)
          .send(messagePayload)
          .then((message) => {
            message.startThread({
              name: title || `${member.displayName}'s clip`,
            });
          });

        interaction.reply({
          content: "Your clip has been posted to the #clips channel",
          ephemeral: true,
        });
      }

      break;
    default:
      break;
  }
});

discord.login(constants.discord.PRIVATE_TOKEN);

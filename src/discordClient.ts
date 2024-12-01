import { Client } from "discord.js";
import {
    Events,
    GuildMember,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";
import { findTextChannel, voiceCommand } from "./helpers";
import constants from "./constants";
import cron from "node-cron";
import { rules } from "./ruleManager";
import winston from "winston";

const client = new Client({ intents: [131071] });

export function initDiscord() {

    // let each rule know the app has started
    client.once(Events.ClientReady, (c) => {
        winston.info(`Ready! Logged in as ${c.user.tag}`);

        rules.filter((r) => r.start).forEach((r) => r.start!());

        cron.schedule("*/1 * * * * *", () => {
            rules.filter((r) => r.tick).forEach((r) => r.tick!());
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
                                .setName(constants.discord.slashCommads.CLIP)
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
                                            "attach clip as a file (beta feature - file must be < 10mb)"
                                        )
                                )
                                .addStringOption((option) =>
                                    option.setName("matchid").setDescription("match id")
                                )
                                .setDescription("Post a clip"),
                            new SlashCommandBuilder()
                                .setName(constants.discord.slashCommads.AMONG_US)
                                .setDescription("Start the Dota 2 x Among Us game mode"),
                            new SlashCommandBuilder()
                                .setName(constants.discord.slashCommads.START_STREAM)
                                .setDescription("Start Canna's twitch stream (if OBS is connected to bot)"),
                            new SlashCommandBuilder()
                                .setName(constants.discord.slashCommads.END_STREAM)
                                .setDescription("End Canna's twitch stream (if OBS is connected to bot)"),
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
            case constants.discord.slashCommads.CLIP:
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
            case constants.discord.slashCommads.AMONG_US:
                {
                    voiceCommand("there is an imposter among us");
                    interaction.reply({
                        content: "`Dota 2 x Among Us` game mode activated",
                        ephemeral: true,
                    });
                }
                break;
            case constants.discord.slashCommads.START_STREAM:
                {
                    winston.info(`Stream - Started by slash command ${interaction.user.displayName}`)
                    voiceCommand("start streamm");
                    interaction.reply({
                        content: "Starting Canna's stream (if Canna's OBS is connected)",
                        ephemeral: true,
                    });
                }
            case constants.discord.slashCommads.END_STREAM:
                {
                    winston.info(`Stream - Ended by slash command ${interaction.user.displayName}`)
                    voiceCommand("end streamm");
                    interaction.reply({
                        content: "Ending Canna's stream (if Canna's OBS is connected)",
                        ephemeral: true,
                    });
                }
            default:
                break;
        }
    });

    client.login(constants.discord.PRIVATE_TOKEN);
}

export default client;

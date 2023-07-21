require("dotenv").config();
import { Client, Events, Guild, VoiceChannel } from "discord.js";
import cron from "node-cron";

const client = new Client({ intents: [131071] });

let bestDota: {
  guild: Guild;
  churchOfRico: VoiceChannel;
  dota2: VoiceChannel;
  general: VoiceChannel;
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = client.guilds.cache.find((g) => g.id === "761903068127428649")!;
  bestDota = {
    guild,
    churchOfRico: findVoiceChannel(guild, "1113512037780303995"),
    dota2: findVoiceChannel(guild, "798885243322499073"),
    general: findVoiceChannel(guild, "773552279265083412"),
  };
});

function findVoiceChannel(guild: Guild, channelId: string) {
  return guild.channels.cache.find((c) => c.id === channelId) as VoiceChannel;
}

function foundRicoInChannel(channel: VoiceChannel) {
  return (
    channel.members.find((m) => m.id === "212986339212263434") !== undefined
  );
}

function moveAllUsers(fromChannel: VoiceChannel, toChannel: VoiceChannel) {
  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

cron.schedule("*/2 * * * * *", () => {
  if (foundRicoInChannel(bestDota.dota2)) {
    moveAllUsers(bestDota.dota2, bestDota.churchOfRico);
  } else if (foundRicoInChannel(bestDota.general)) {
    moveAllUsers(bestDota.general, bestDota.churchOfRico);
  }
});

client.login(process.env.DISCORD_PRIVATE_TOKEN);

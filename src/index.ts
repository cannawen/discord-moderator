require("dotenv").config();
import cron from "node-cron";
import Discord from "discord.js";

// Create a new client instance
const client = new Discord.Client({ intents: [131071] });

interface BestDota {
  guild: Discord.Guild;
  churchOfRico: Discord.VoiceChannel;
  dota2: Discord.VoiceChannel;
  general: Discord.VoiceChannel;
}

let bestDota: BestDota;

// When the client is ready, run this code (only once)
client.once(Discord.Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = client.guilds.cache.find((g) => g.id === "761903068127428649")!;
  bestDota = {
    guild,
    churchOfRico: findVoiceChannel(guild, "1113512037780303995"),
    dota2: findVoiceChannel(guild, "798885243322499073"),
    general: findVoiceChannel(guild, "773552279265083412"),
  };
});

function findVoiceChannel(guild: Discord.Guild, channelId: string) {
  return guild.channels.cache.find(
    (c) => c.id === channelId
  ) as Discord.VoiceChannel;
}

function foundRicoInChannel(channel: Discord.VoiceChannel) {
  return (
    channel.members.find((m) => m.id === "212986339212263434") !== undefined
  );
}

function moveAllUsers(
  fromChannel: Discord.VoiceChannel,
  toChannel: Discord.VoiceChannel
) {
  fromChannel.members.forEach((m) => m.voice.setChannel(toChannel));
}

cron.schedule("*/2 * * * * *", () => {
  if (foundRicoInChannel(bestDota.dota2)) {
    moveAllUsers(bestDota.dota2, bestDota.churchOfRico);
  } else if (foundRicoInChannel(bestDota.general)) {
    moveAllUsers(bestDota.general, bestDota.churchOfRico);
  }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_PRIVATE_TOKEN);

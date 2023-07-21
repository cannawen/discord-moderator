require("dotenv").config();
import Discord from "discord.js";

// Create a new client instance
const client = new Discord.Client({ intents: [131071] });
let guild: Discord.Guild | undefined;

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Discord.Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  guild = client.guilds.cache.find((g) => g.id === "761903068127428649");
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_PRIVATE_TOKEN);

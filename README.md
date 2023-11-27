# discord-moderator

`canna-bot` automatically joins Cannd or Teazy's voice channels

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota server only - will not work with any other discord servers)

---

# Voice commands

## Member movement

- `Take me/us to <channel>` moves members from the current voice channel to `<channel>`
- `Take everyone/everybody to <channel>` moves all members connected to any voice channel
- See [here](src/rules/voiceCommands/massMigration.ts) for channel name definitions
- `See you later nerds` or `Disconnect` disconnects the speaker from Discord
- `Coach me` brings dota-coach bot over to the member's current voice channel (does not start coaching)
- `Come in`, `Enter`, or `Allow` joins a member to a protected channel after knocking
- `No thank you`, `No thanks`, or `Disallow` does not join them

## Clips

- `Snapshot` records the last couple minutes of Canna's screen via OBS (saved onto a local machine)
- `Reconnect` tries to reconnect to Canna's OBS (protected command)

## Other

- [Plays voicelines](src/rules/voiceCommands/voicelines.ts) (all voicelines prepended with `voiceline` or `soundboard` trigger)
- `Disable audio` stops the bot from playing any audio for 1 hour (or until the bot leaves/rejoins), and `Enable audio` allows the bot to play audio again
- `Mute JP` server mutes jproperly for 2 minutes (protected command)

---

# What else does the bot do?

- `/clip` allows anyone to post to the #clips channel
- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname every two weeks on a 6-week cycle depending on which shift he is working
- When wrabbit and Target are in the same voice channel, renames it `Home <3` (NOTE: there is a discord rate limit of 2 renames per 10 minutes)

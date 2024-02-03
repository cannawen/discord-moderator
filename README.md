# discord-moderator

`canna-bot` automatically joins Canna or Teazy's voice channels

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
- `Hey/OK bot` asks OpenAI's ChatGPT a question. `Hey/OK dad` responds with dad jokes.

### In-house

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
  - In-house splitting mode also stops when Canna says `Radiant` or `Dire`
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`
- `There is an imposter among us` or `/amongus` slash command triggers [Dota 2 x Among Us](./AmongUs.md) game mode
- `Start discussion timer` sets a 10-minute timer with 5 and 1 minute remaining warnings
  - `Stop/Cancel` or `Stop/Cancel discussion timer` cancels the remainder of the timers

## Clips and Streaming

- `/clip` allows anyone to post to the #clips channel
- `Snapshot` records the last couple minutes of Canna's screen via OBS (saved onto a local machine)
- `Reconnect` tries to reconnect to Canna's OBS (protected command)
- `Start/End stream` manages state of [Canna's twitch stream](https://www.twitch.tv/cannadota)
- Moves users to `mode: streaming` voice channel when appropriate

## Other

- [Plays soundboard audio](src/rules/voiceCommands/soundboard.ts)
- `Disable audio` stops the bot from playing any audio for 1 hour (or until the bot leaves/rejoins)
- `Enable audio` allows the bot to play audio again
- `Stop audio/Stop/Cancel` stops the currently playing audio file
- `Mute JP` server mutes jproperly for 2 minutes (protected command)

---

# What else does the bot do?

- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname every two weeks on a 6-week cycle depending on which shift he is working
- When wrabbit and Target are in the same voice channel, renames it `Home <3` (NOTE: there is a discord rate limit of 2 renames per 10 minutes)

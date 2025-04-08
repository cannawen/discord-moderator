`canna-bot` automatically joins Canna or Teazy's voice channels

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota server only - will not work with any other discord servers)

# Member Movement

- `Take me/us to <channel>` moves members from the current voice channel to `<channel>`
- `Take everyone/everybody to <channel>` moves all members connected to any voice channel
- See [here](src/rules/voiceCommands/massMigration.ts) for channel name definitions
- `See you later nerds` or `Disconnect` disconnects the speaker from Discord
- `Coach me` brings dota-coach bot over to the member's current voice channel (or starts coaching with Canna's ID if bot is not currently in any channel)
- `Kick bot` moves dota-coach to `Lobby` channel
- Ensures dota-coach and New Dota Coach are not in the same channel

## Protected Channel Alerts

- When the bot is in a protected channel and a user enters a non-protected channel, the bot knocks and announces the new user's name
- Keywords `Come in`, `Enter`, `Allow`, `Yes`, `OK`, `Accept` moves the user to the protected channel
- Keywords `No thank you`, `No thanks`, `Disallow`, `No` does not move them

## In-House User Management

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Radiant` also aliased to `One`, `Dire` aliased to `Two`
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
  - In-house splitting mode also stops when Canna is moved to `Radiant` or `Dire` channel
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`

### Imposter Mode 

- `There is an imposter among us` or `/amongus` slash command triggers [Dota 2 x Among Us](./AmongUs.md) game mode
- `Start discussion timer` sets a 10-minute timer with 5 and 1 minute remaining warnings
  - `Stop/Cancel` or `Stop/Cancel discussion timer` cancels the remainder of the timers

# Clipping

- `/clip` allows anyone to post to the #clips channel
- `Snapshot` records the last couple minutes of Canna's screen via OBS (saved onto a local machine)
- `Reconnect` tries to reconnect to Canna's OBS (protected command)

# Streaming (https://www.twitch.tv/cannadota)

- `Start/End stream` manages state of [Canna's twitch stream](https://www.twitch.tv/cannadota)
  - Moves users to `mode: streaming` voice channel when appropriate
  - Also controllable with `/startstream` or `/endstream` commands
  - Canna's `Disconnect/See you later nerds` voice command also stops stream
  - `End stream silently/quietly` does not provide audio feedback on if stream was successfully ended
- `OBS x` changes the OBS scene. Current options for x are: default, off, volume off
- Plays twitch messages as text-to-speech over discord

# Talking to ChatGPT

- `Hey/OK bot` asks OpenAI's ChatGPT a question
- `Hey/OK limerick/haiku/poem` responds with a Dota 2-specific poem and posts the results to #bots
- `Hey/OK dad` responds with dad jokes
- `Hey/OK waiter` responds with puns pertaining to the object in the soup
- `Hey/OK draw/imagine <prompt>` uses Dall-E 3 to generate an image and posts to #bots
  - Or use `/draw` slash command
- `Stop/Cancel` stops the ChatGPT request

# Other

- [Plays soundboard audio](src/rules/voiceCommands/soundboard.ts)
- `Disable/Mute audio` stops the bot from playing any audio for 1 hour (or until the bot leaves/rejoins)
- `Enable audio` allows the bot to play audio again
- `Stop audio/Stop/Cancel` stops the currently playing audio file
- `Mute JP` server mutes jproperly for 2 minutes (protected command)
- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname depending on what day it is
- Sets the voice channel names to the constants specified in [constants.js](src/constants.ts)

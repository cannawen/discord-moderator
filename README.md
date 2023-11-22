# discord-moderator

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota server only - will not work with any other discord servers)

---

## Voice commands

`canna-bot` automatically joins Best Dota guild's voice channels (prioritizing Canna's channel)

### Member movement

- `Take me to general` moves members from the current voice channel to `General`
- `Take me to (real) secrets` moves members to the locked channel(s) (Protected command)
- `Take us to general/secrets` moves all members connected to any voice channel
- `See you later nerds` or `Disconnect` disconnects the speaker from Discord
- `Coach me` brings dota-coach bot over to the member's current voice channel (does not start coaching)
- `Come in`, `Enter`, or `Allow` joins a member to the secret channel after knocking
- `No thank you`, `No thanks`, or `Disallow` does not join them to the secret channel
- `Who's there` speaks the name of the person requesting to join

### Clips

- `Snapshot` records the last 120 seconds of Canna's screen via OBS (saved onto a local machine)
- `Reconnect` tries to reconnect to OBS

### Other

- `Mute JP` server mutes jproperly for 2 minutes (Protected command)
- `Disable audio` stops the bot from playing any audio for 1 hour (or until the bot leaves/rejoins), and `Enable audio` allows the bot to play audio again
- Plays voicelines: see [here](src/rules/voicelines.ts) for voiceline triggers (prepended with "voiceline" or "soundboard")

---

## What else does the bot do?

- `/clip` allows anyone to post to the #clips channel
- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname every two weeks on a 6-week cycle depending on which shift he is working
- When wrabbit and Target are in the same voice channel, rename it `Home` (NOTE: discord rate limit of 2x/10 minutes)

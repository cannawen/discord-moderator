# discord-moderator

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota server only - will not work with any other discord servers)

---

## Voice commands

`canna-bot` automatically joins Canna or Teazy's voice channel

### Clips

- `Snapshot` records the last 120 seconds of Canna's screen via OBS (saved onto a local machine)
- `Reconnect` tries to reconnect to OBS

### Member movement

- `Take me to general` moves all members from any voice channel to `General`
- `Take me to (real) secrets` brings everyone to the secret channel (Protected command)
- `See you later nerds` or `Disconnect` disconnects the speaker from Discord
- `Coach me` brings dota-coach bot over to the member's current voice channel (does not start coaching)

### In-house

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`

### Other

- `Mute JP` server mutes jproperly for 2 minutes (Protected command)
- `Win/Lose/Slay together` triggers the ceb voiceline

---

## Slash commands

- Anyone can `/disconnect` the bot from a voice channel
- `/clip` allows anyone to post to the #clips channel

---

## What else does the bot do?

- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname every two weeks on a 6-week cycle depending on which shift he is working
- Tag members who react 👀 to the `looking for stack` pinned message with the `lfs` role

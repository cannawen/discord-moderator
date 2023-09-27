# discord-moderator

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota guild only)  
The bot automatically joins the voice channel if Canna is present

## Voice commands

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`
- `Take me to general` moves all members from any voice channel to `General`
- `See you later nerds` disconnects the speaker
- `Coach me` brings dota-coach bot over to the member's current voice channel
- `Win/Lose/Slay together` triggers the ceb voiceline
- `Snapshot` or `Unlucky` clips the last 60 seconds of video via OBS WebSockets x Tailscale
- `Reconnect` tries to reconnect to OBS

## Protected voice commands

- `Take me to secrets` brings everyone to the fake secret channel
- `Mute JP` server mutes jproperly for 2 minutes

## Slash commands

- Anyone can `/disconnect` the bot from a voice channel
- `/clip` allows anyone to post to the #clips channel

## What else does the bot do?

- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname every two weeks depending on which shift he is working
- Tag members who react 👀 to the `looking for stack` pinned message with the `lfs` role

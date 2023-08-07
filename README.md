# discord-moderator

[Link to add bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot) (values are currently hard coded to Best Dota guild only)  
The bot automatically joins the voice channel if Canna is present

## Voice commands

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`
- `Take me to church/general` moves all members from any voice channel to `The Church of Rico` or `General`
- `See you later nerds` disconnects the speaker
- `Coach me` brings dota-coach bot over to the member's current voice channel

## Protected voice commands

- `Take me to secrets` brings everyone to the top secret channel
- `Mute JP` server mutes jproperly for 2 minutes

## Slash commands

- Anyone can `/disconnect` the bot

## What else does the bot do?

- Moves everyone in `General` or `Dota 2` into `The Church of Rico` if Rico joins
- Tags all newcomers `everyone-expect-drabz` to give them permissions to move members between voice channels
- Changes Drabz's nickname depending on which shift he is working

# discord-moderator

[Invite bot](https://discord.com/api/oauth2/authorize?client_id=1062766623578148945&permissions=8&scope=bot)  
The bot automatically joins the voice channel if Canna is present

## Voice commands

- `Start in house` or `Should I stay or should I go` enters in-house splitting mode
  - When members say `Radiant` or `Dire` they get moved to the appropriate voice channel
  - `Cancel`, `Stop`, or `Done` stops in-house splitting mode
- `Reset in house` or `Take me to lobby` moves members in `Radiant` and `Dire` to `Lobby`
- `Take me to church/general` moves all members from any voice channel to `The Church of Rico` or `General`
- `See you later nerds` disconnects the speaker
- `Coach me` brings dota-coach bot over to the member's current voice channel

## Slash commands

- Anyone can `/disconnect` the bot

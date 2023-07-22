import { Client, Guild } from "discord.js";

type Rule = (
  client: Client,
  guild: Guild,
  tick: (f: () => void) => void
) => void;

export default Rule;

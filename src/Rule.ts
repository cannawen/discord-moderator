import { Client, Guild } from "discord.js";

export default class Rule {
  public readonly description: string;
  public readonly registerClient?: (client: Client) => void;
  public readonly registerGuild?: (
    guild: Guild,
    onTick: (f: () => void) => void
  ) => void;

  constructor(params: {
    description: string;
    registerClient?: (client: Client) => void;
    registerGuild?: (guild: Guild, onTick: (f: () => void) => void) => void;
  }) {
    this.description = params.description;
    this.registerClient = params.registerClient;
    this.registerGuild = params.registerGuild;
  }
}

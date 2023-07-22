import { Guild } from "discord.js";

export default class Rule {
  public readonly register: (guild: Guild) => void;
  public readonly description: string;

  constructor(description: string, register: (guild: Guild) => void) {
    this.description = description;
    this.register = register;
  }
}

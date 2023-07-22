import { Client, Guild } from "discord.js";

export default class Rule {
  public readonly register: (guild: Guild) => void;

  constructor(register: (guild: Guild) => void) {
    this.register = register;
  }
}

import { Client, Guild } from "discord.js";

export default class Rule {
  public readonly description: string;
  public readonly start?: (client: Client) => void;
  public readonly tick?: (guild: Guild) => void;
  public readonly utterance?: (guild: Guild, utterance: string) => void;

  constructor(params: {
    description: string;
    start?: (client: Client) => void;
    tick?: (guild: Guild) => void;
    utterance?: (guild: Guild, utterance: string) => void;
  }) {
    this.description = params.description;
    this.start = params.start;
    this.tick = params.tick;
    this.utterance = params.utterance;
  }
}

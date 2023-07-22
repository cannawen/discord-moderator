import { Client, Guild } from "discord.js";

export default class Rule {
  public readonly description: string;
  public readonly start?: (guild: Guild, client: Client) => void;
  public readonly tick?: (guild: Guild, client: Client) => void;
  public readonly utterance?: (guild: Guild, utterance: string) => void;

  constructor(params: {
    description: string;
    start?: (guild: Guild, client: Client) => void;
    tick?: (guild: Guild, client: Client) => void;
    utterance?: (guild: Guild, utterance: string) => void;
  }) {
    this.description = params.description;
    this.start = params.start;
    this.tick = params.tick;
    this.utterance = params.utterance;
  }
}

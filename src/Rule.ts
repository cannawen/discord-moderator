import { Client, Guild } from "discord.js";

export default class Rule {
  public readonly description: string;
  public readonly start?: () => void;
  public readonly tick?: () => void;
  public readonly utterance?: (utterance: string, memberId: string) => void;

  constructor(params: {
    description: string;
    start?: () => void;
    tick?: () => void;
    utterance?: (utterance: string, memberId: string) => void;
  }) {
    this.description = params.description;
    this.start = params.start;
    this.tick = params.tick;
    this.utterance = params.utterance;
  }
}

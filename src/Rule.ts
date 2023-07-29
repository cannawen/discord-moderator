export default class Rule {
  public readonly description: string;
  public readonly start?: () => void;
  public readonly utterance?: (utterance: string, memberId: string) => void;

  constructor(params: {
    description: string;
    start?: () => void;
    utterance?: (utterance: string, memberId: string) => void;
  }) {
    this.description = params.description;
    this.start = params.start;
    this.utterance = params.utterance;
  }
}

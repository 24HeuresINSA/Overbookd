import { Field } from "./field";
import { Teams } from "../fulfilled-registration";

export class TeamsField implements Field<Teams> {
  private constructor(private readonly teams: Teams) {}

  get value(): Teams {
    return this.teams;
  }

  private readonly MAX_TEAM_ALLOWED = 2;

  get isValid(): boolean {
    return this.teams.length <= this.MAX_TEAM_ALLOWED;
  }

  get reasons(): string[] {
    return this.isValid
      ? []
      : [`Tu ne peux pas rejoindre plus de ${this.MAX_TEAM_ALLOWED} équipes`];
  }

  static build(teams: Teams): TeamsField {
    return new TeamsField(teams);
  }
}

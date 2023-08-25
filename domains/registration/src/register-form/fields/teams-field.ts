import { Field } from "./field";
import { TeamCode } from "../../registree";

export class TeamsField implements Field<TeamCode[]> {
  private constructor(private readonly teams: TeamCode[]) {}

  get value(): TeamCode[] {
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

  static build(teams: TeamCode[]): TeamsField {
    return new TeamsField(teams);
  }
}

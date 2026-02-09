import { Membership, VOLUNTEER } from "../../newcomer.js";
import { Field } from "./field.js";
import { shouldSignVolunteerCharter } from "../register-form.js"

export class VolunteerCharterField implements Field<boolean> {
  private constructor(
    private readonly membership: Membership,
    private readonly hasApprovedVolunteerCharter: boolean,
  ) {}

  get value(): boolean {
    return this.hasApprovedVolunteerCharter;
  }

  get isValid(): boolean {
    if (!shouldSignVolunteerCharter(this.membership)) return true;
    return this.hasApprovedVolunteerCharter === true;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["La Charte Bénévole doit être approuvée"];
  }

  static build(
    membership: Membership,
    hasApprovedVolunteerCharter?: boolean,
  ): VolunteerCharterField {
    return new VolunteerCharterField(
      membership,
      hasApprovedVolunteerCharter ?? false,
    );
  }
}

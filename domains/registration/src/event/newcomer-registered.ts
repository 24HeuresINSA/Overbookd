import { Teams } from "../register-form";
import { Registree } from "../register-newcomer";

export const ADHERENT = "adherent";
export const VOLUNTEER = "volunteer";

type Member = typeof ADHERENT | typeof VOLUNTEER;
type WithMembership<T extends Member> = { membership: T };

type NewcomerRegistered<T extends Member> = Registree & WithMembership<T>;

export type AdherentRegistered = NewcomerRegistered<typeof ADHERENT>;
export type VolunteerRegistered = NewcomerRegistered<typeof VOLUNTEER>;

export class NewcomerRegisteredEvent<T extends Member>
  implements NewcomerRegistered<T>
{
  readonly id: number;
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly mobilePhone: string;
  readonly nickname?: string;
  readonly birthdate: Date;
  readonly comment?: string;
  readonly teams: Teams;
  readonly membership: T;

  private constructor(registered: NewcomerRegisteredEvent<T>) {
    this.id = registered.id;
    this.email = registered.email;
    this.firstname = registered.firstname;
    this.lastname = registered.lastname;
    this.mobilePhone = registered.mobilePhone;
    this.nickname = registered.nickname;
    this.birthdate = registered.birthdate;
    this.comment = registered.comment;
    this.teams = registered.teams;
    this.membership = registered.membership;
  }

  static create<T extends Member>(
    registree: Registree,
    membership: T,
  ): NewcomerRegisteredEvent<T> {
    return new NewcomerRegisteredEvent({ ...registree, membership });
  }
}

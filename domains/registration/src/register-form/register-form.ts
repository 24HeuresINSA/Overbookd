import { Field } from "./fields/field.js";
import { EmailField } from "./fields/email-field.js";
import { FirstNameField } from "./fields/first-name-field.js";
import { LastNameField } from "./fields/last-name-field.js";
import { PasswordField } from "./fields/password-field.js";
import { MobilePhoneField } from "./fields/mobile-phone-field.js";
import { NicknameField } from "./fields/nickname-field.js";
import { BirthDateField } from "./fields/birth-date-field.js";
import { CommentField } from "./fields/comment-field.js";
import { TeamsField } from "./fields/teams-field.js";
import {
  AccountStatus,
  accountStatuses,
  BaseFulfilledRegistration,
  FulfilledRegistration,
  Teams,
} from "./fulfilled-registration.js";
import { EULAField } from "./fields/EULA-field.js";
import { VolunteerCharterField } from "./fields/volunteer-charter-field.js";
import { Membership, VOLUNTEER } from "../newcomer.js";
import { NotFulfilledRegistration } from "./registration.error.js";

export class RegisterForm {
  private email: EmailField;
  private firstName: FirstNameField;
  private lastName: LastNameField;
  private password: PasswordField;
  private mobilePhone: MobilePhoneField;
  private nickname: NicknameField;
  private birthDate: BirthDateField;
  private comment: CommentField;
  private teams: TeamsField;
  private EULA: EULAField;
  private volunteerCharter: VolunteerCharterField;

  private constructor(
    private readonly membership: Membership,
    private readonly accountStatus: AccountStatus,
    private readonly data: Partial<BaseFulfilledRegistration> & {
      password?: string;
    },
  ) {
    this.email = EmailField.build(data.email ?? "");
    this.firstName = FirstNameField.build(data.firstName ?? "");
    this.lastName = LastNameField.build(data.lastName ?? "");
    this.password = PasswordField.build(data.password, accountStatus);
    this.mobilePhone = MobilePhoneField.build(data.mobilePhone ?? "");
    this.nickname = NicknameField.build(data.nickname);
    this.birthDate = BirthDateField.build(
      data.birthDate ?? new Date("1949-12-25"),
    );
    this.comment = CommentField.build(data.comment);
    this.teams = TeamsField.build(data.teams ?? []);
    this.EULA = EULAField.build(data.hasApprovedEULA);
    this.volunteerCharter = VolunteerCharterField.build(
      membership,
      data.hasSignedVolunteerCharter,
    );
  }

  static initFor(
    membership: Membership,
    accountStatus: AccountStatus,
  ): RegisterForm {
    return new RegisterForm(membership, accountStatus, {});
  }

  fillEmail(email: string): RegisterForm {
    return this.clone({ email });
  }

  clearEmail(): RegisterForm {
    return this.clone({ email: undefined });
  }

  fillFirstName(firstName: string): RegisterForm {
    return this.clone({ firstName });
  }

  clearFirstName(): RegisterForm {
    return this.clone({ firstName: undefined });
  }

  fillLastName(lastName: string): RegisterForm {
    return this.clone({ lastName });
  }

  clearLastName(): RegisterForm {
    return this.clone({ lastName: undefined });
  }

  fillPassword(password: string): RegisterForm {
    return this.clone({ password });
  }

  clearPassword(): RegisterForm {
    return this.clone({ password: undefined });
  }

  fillMobilePhone(mobilePhone: string): RegisterForm {
    return this.clone({ mobilePhone });
  }

  clearMobilePhone(): RegisterForm {
    return this.clone({ mobilePhone: undefined });
  }

  fillNickname(nickname?: string): RegisterForm {
    return this.clone({ nickname });
  }

  clearNickname(): RegisterForm {
    return this.clone({ nickname: undefined });
  }

  fillBirthDate(birthDate: Date): RegisterForm {
    return this.clone({ birthDate });
  }

  clearBirthDate(): RegisterForm {
    return this.clone({ birthDate: undefined });
  }

  fillComment(comment?: string): RegisterForm {
    return this.clone({ comment });
  }

  clearComment(): RegisterForm {
    return this.clone({ comment: undefined });
  }

  fillTeams(teams: Teams): RegisterForm {
    return this.clone({ teams });
  }

  clearTeams(): RegisterForm {
    return this.clone({ teams: [] });
  }

  approveEndUserLicenceAgreement(): RegisterForm {
    return this.clone({ hasApprovedEULA: true });
  }

  denyEndUserLicenceAgreement(): RegisterForm {
    return this.clone({ hasApprovedEULA: false });
  }

  signVolunteerCharter(): RegisterForm {
    return this.clone({ hasSignedVolunteerCharter: true });
  }

  denyVolunteerCharter(): RegisterForm {
    return this.clone({ hasSignedVolunteerCharter: false });
  }

  private clone(
    patch: Partial<BaseFulfilledRegistration> & { password?: string },
  ): RegisterForm {
    return new RegisterForm(this.membership, this.accountStatus, {
      ...this.data,
      ...patch,
    });
  }

  private get currentRegistration(): Partial<FulfilledRegistration> {
    const volunteerCharter = shouldSignVolunteerCharter(this.membership)
      ? { hasSignedVolunteerCharter: this.volunteerCharter.value }
      : {};
    const password = this.needsPassword
        ? { password: this.password.value }
        : {};

    return {
      status: this.accountStatus,
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      mobilePhone: this.mobilePhone.value,
      nickname: this.nickname.value,
      birthDate: this.birthDate.value,
      comment: this.comment.value,
      teams: this.teams.value,
      hasApprovedEULA: this.EULA.value,
      ...password,
      ...volunteerCharter,
    };
  }

  private get fields(): Field<unknown>[] {
    return [
      this.email,
      this.firstName,
      this.lastName,
      this.password,
      this.mobilePhone,
      this.nickname,
      this.birthDate,
      this.comment,
      this.teams,
      this.EULA,
      this.volunteerCharter,
    ];
  }

  get isValid(): boolean {
    return this.fields.every((field) => field?.isValid);
  }

  get reasons(): string[] {
    return this.fields.flatMap((field) => field.reasons);
  }

  get needsPassword(): boolean {
    return this.accountStatus === accountStatuses.NEW;
  }

  complete(): FulfilledRegistration {
    if (!this.isFulfilled(this.currentRegistration)) {
      throw new NotFulfilledRegistration(this.reasons);
    }
    return this.currentRegistration;
  }

  private isFulfilled(
    _registration: Partial<FulfilledRegistration>,
  ): _registration is FulfilledRegistration {
    return this.isValid;
  }
}

export function shouldSignVolunteerCharter(membership: Membership): boolean {
  return membership === VOLUNTEER;
}

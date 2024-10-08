import { Field } from "./fields/field.js";
import { EmailField } from "./fields/email-field.js";
import { FirstnameField } from "./fields/firstname-field.js";
import { LastnameField } from "./fields/lastname-field.js";
import { PasswordField } from "./fields/password-field.js";
import { MobilePhoneField } from "./fields/mobile-phone-field.js";
import { NicknameField } from "./fields/nickname-field.js";
import { BirthdateField } from "./fields/birthdate-field.js";
import { CommentField } from "./fields/comment-field.js";
import { TeamsField } from "./fields/teams-field.js";
import { FulfilledRegistration, Teams } from "./fulfilled-registration.js";
import { EULAField } from "./fields/EULA-field.js";

export class RegisterForm {
  private email: EmailField;
  private firstname: FirstnameField;
  private lastname: LastnameField;
  private password: PasswordField;
  private mobilePhone: MobilePhoneField;
  private nickname: NicknameField;
  private birthdate: BirthdateField;
  private comment: CommentField;
  private teams: TeamsField;
  private EULA: EULAField;

  private constructor({
    email,
    firstname,
    lastname,
    password,
    mobilePhone,
    nickname,
    birthdate,
    comment,
    teams,
    hasApprovedEULA,
  }: Partial<FulfilledRegistration>) {
    this.email = EmailField.build(email ?? "");
    this.firstname = FirstnameField.build(firstname ?? "");
    this.lastname = LastnameField.build(lastname ?? "");
    this.password = PasswordField.build(password ?? "");
    this.mobilePhone = MobilePhoneField.build(mobilePhone ?? "");
    this.nickname = NicknameField.build(nickname);
    this.birthdate = BirthdateField.build(birthdate ?? new Date("1949-12-25"));
    this.comment = CommentField.build(comment);
    this.teams = TeamsField.build(teams ?? []);
    this.EULA = EULAField.build(hasApprovedEULA);
  }

  static init(): RegisterForm {
    return new RegisterForm({});
  }

  fillEmail(email: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, email });
  }

  clearEmail(): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, email: undefined });
  }

  fillFirstname(firstname: string) {
    return new RegisterForm({ ...this.currentRegistration, firstname });
  }

  clearFirstname(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      firstname: undefined,
    });
  }

  fillLastname(lastname: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, lastname });
  }

  clearLastname(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      lastname: undefined,
    });
  }

  fillPassword(password: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, password });
  }

  clearPassword(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      password: undefined,
    });
  }

  fillMobilePhone(mobilePhone: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, mobilePhone });
  }

  clearMobilePhone(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      mobilePhone: undefined,
    });
  }

  fillNickname(nickname: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, nickname });
  }

  clearNickname(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      nickname: undefined,
    });
  }

  fillBirthdate(birthdate: Date): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, birthdate });
  }

  clearBirthdate(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      birthdate: undefined,
    });
  }

  fillComment(comment: string): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, comment });
  }

  clearComment(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      comment: undefined,
    });
  }

  fillTeams(teams: Teams): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, teams });
  }

  clearTeams(): RegisterForm {
    return new RegisterForm({ ...this.currentRegistration, teams: [] });
  }

  approveEndUserLicenceAgreement(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      hasApprovedEULA: true,
    });
  }

  denyEndUserLicenceAgreement(): RegisterForm {
    return new RegisterForm({
      ...this.currentRegistration,
      hasApprovedEULA: false,
    });
  }

  private get currentRegistration(): Partial<FulfilledRegistration> {
    return {
      email: this.email.value,
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      password: this.password.value,
      mobilePhone: this.mobilePhone.value,
      nickname: this.nickname.value,
      birthdate: this.birthdate.value,
      comment: this.comment.value,
      teams: this.teams.value,
      hasApprovedEULA: this.EULA.value,
    };
  }

  private get fields(): Field<unknown>[] {
    return [
      this.email,
      this.firstname,
      this.lastname,
      this.password,
      this.mobilePhone,
      this.nickname,
      this.birthdate,
      this.comment,
      this.teams,
      this.EULA,
    ];
  }

  get isValid(): boolean {
    return this.fields.every((field) => field?.isValid);
  }

  get reasons(): string[] {
    return this.fields.flatMap((field) => field.reasons);
  }

  complete(): FulfilledRegistration {
    if (!this.isFulfilled(this.currentRegistration)) {
      throw new NotFulfilledRegistration(this.reasons);
    }
    return this.currentRegistration;
  }

  private isFulfilled(
    registration: Partial<FulfilledRegistration>,
  ): registration is FulfilledRegistration {
    return this.isValid;
  }
}

export class RegistrationError extends Error {
  constructor(
    readonly reasons: string[],
    errorMessage: string = "Erreur lors de l'inscription",
  ) {
    super(`${errorMessage}:\n${reasons.join("\n")}`);
  }
}

class NotFulfilledRegistration extends RegistrationError {
  constructor(reasons: string[]) {
    super(reasons, "L'inscription n'est pas complète");
  }
}

import { Membership, NewcomerRegistered } from "./newcomer.js";
import { FulfilledRegistration } from "./register-form/fulfilled-registration.js";
import {
  PASSWORD_REQUIRED,
  PasswordRequirement,
} from "./register-form/password-requirement.js";
import { RegisterForm } from "./register-form/register-form.js";

export type NewcomerRepository = {
  save: <T extends Membership>(
    fulfilledForm: FulfilledRegistration,
    membership: T,
  ) => Promise<NewcomerRegistered<T>>;
};

export class RegisterNewcomer {
  constructor(private readonly newcomerRepository: NewcomerRepository) {}

  async fromRegisterForm(
    form: Partial<FulfilledRegistration>,
    membership: Membership,
    passwordRequirement: PasswordRequirement,
  ) {
    const dataForm = RegisterForm.initFor(membership, passwordRequirement)
      .fillEmail(form.email ?? "")
      .fillFirstName(form.firstName ?? "")
      .fillLastName(form.lastName ?? "")
      .fillMobilePhone(form.mobilePhone ?? "")
      .fillBirthDate(form.birthDate ?? new Date("1949-12-25"))
      .fillTeams(form.teams ?? []);
    const withNickname =
      form.nickname !== undefined
        ? dataForm.fillNickname(form.nickname)
        : dataForm.clearNickname();
    const withComment =
      form.comment !== undefined
        ? withNickname.fillComment(form.comment)
        : withNickname.clearComment();
    const withPassword =
      passwordRequirement === PASSWORD_REQUIRED
        ? withComment.fillPassword(form.password ?? "")
        : withComment.clearPassword();
    const withEULA = form.hasApprovedEULA
      ? withPassword.approveEndUserLicenceAgreement()
      : withPassword.denyEndUserLicenceAgreement();
    const withVolunteerCharter = form?.hasSignedVolunteerCharter
      ? withEULA.signVolunteerCharter()
      : withEULA.denyVolunteerCharter();
    const fulfilledForm = withVolunteerCharter.complete();

    return this.newcomerRepository.save(fulfilledForm, membership);
  }
}

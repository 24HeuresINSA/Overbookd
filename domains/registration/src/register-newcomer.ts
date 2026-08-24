import { Membership, NewcomerRegistered } from "./newcomer.js";
import {
  AccountStatus,
  BaseFulfilledRegistration,
  FulfilledRegistration,
  isNewAccountRegistration,
} from "./register-form/fulfilled-registration.js";
import { RegisterForm } from "./register-form/register-form.js";

export type NewcomerRepository = {
  save: <T extends Membership>(
    fulfilledForm: BaseFulfilledRegistration,
    membership: T,
  ) => Promise<NewcomerRegistered<T>>;
};

export class RegisterNewcomer {
  constructor(private readonly newcomerRepository: NewcomerRepository) {}

  async fromRegisterForm(
    form: Partial<FulfilledRegistration>,
    membership: Membership,
    accountStatus: AccountStatus,
  ) {
    const dataForm = RegisterForm.initFor(membership, accountStatus)
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
    const withPassword = isNewAccountRegistration(form)
      ? withComment.fillPassword(form.password ?? "")
      : withComment.clearPassword();
    const withEULA = form.hasApprovedEULA
      ? withPassword.approveEndUserLicenceAgreement()
      : withPassword.denyEndUserLicenceAgreement();
    const withVolunteerCharter = form?.hasSignedVolunteerCharter
      ? withEULA.signVolunteerCharter()
      : withEULA.denyVolunteerCharter();
    const fulfilledForm = withVolunteerCharter.complete();
    const personalData = stripRegistrationData(fulfilledForm);

    return this.newcomerRepository.save(personalData, membership);
  }
}

function stripRegistrationData(
  registration: FulfilledRegistration,
): BaseFulfilledRegistration {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, ...rest } = registration;

  if (isNewAccountRegistration(registration)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, password, ...withoutPassword } = registration;
    return withoutPassword;
  }

  return rest;
}

import { Membership, NewcomerRegistered, Registree } from "./newcomer.js";
import {
  BaseFulfilledRegistration,
  FulfilledRegistration,
  isNewAccountRegistration,
} from "./register-form/fulfilled-registration.js";
import { RegisterForm } from "./register-form/register-form.js";

export type NewcomerRepository = {
  save: (fulfilledForm: BaseFulfilledRegistration) => Promise<Registree>;
};

export class RegisterNewcomer {
  constructor(private readonly newcomerRepository: NewcomerRepository) {}

  async fromRegisterForm(
    form: FulfilledRegistration,
    membership: Membership,
  ): Promise<NewcomerRegistered<Membership>> {
    const dataForm = RegisterForm.initFor(membership, form.status)
      .fillEmail(form.email)
      .fillFirstName(form.firstName)
      .fillLastName(form.lastName)
      .fillMobilePhone(form.mobilePhone)
      .fillBirthDate(form.birthDate)
      .fillTeams(form.teams);
    const withNickname =
      form.nickname !== undefined
        ? dataForm.fillNickname(form.nickname)
        : dataForm.clearNickname();
    const withComment =
      form.comment !== undefined
        ? withNickname.fillComment(form.comment)
        : withNickname.clearComment();
    const withPassword = isNewAccountRegistration(form)
      ? withComment.fillPassword(form.password)
      : withComment.clearPassword();
    const withEULA = form.hasApprovedEULA
      ? withPassword.approveEndUserLicenceAgreement()
      : withPassword.denyEndUserLicenceAgreement();
    const withVolunteerCharter = form.hasSignedVolunteerCharter
      ? withEULA.signVolunteerCharter()
      : withEULA.denyVolunteerCharter();
    const fulfilledForm = withVolunteerCharter.complete();
    const personalData = stripRegistrationData(fulfilledForm);

    const registree = await this.newcomerRepository.save(personalData);
    return { ...registree, membership };
  }
}

function stripRegistrationData(
  registration: FulfilledRegistration,
): BaseFulfilledRegistration {
  if (isNewAccountRegistration(registration)) {
    const {
      status: _status,
      password: _password,
      ...withoutPassword
    } = registration;
    return withoutPassword;
  }

  const { status: _status, ...rest } = registration;
  return rest;
}

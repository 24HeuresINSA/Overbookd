import { Membership, NewcomerRegistered } from "./newcomer.js";
import { FulfilledRegistration } from "./register-form/fulfilled-registration.js";
import {
  RegisterForm,
  RegistrationError,
} from "./register-form/register-form.js";

export type NewcomerRepository = {
  isEmailUsed(email: string): Promise<boolean>;
  save: <T extends Membership>(
    fulfilledForm: FulfilledRegistration,
    membership: T,
  ) => Promise<NewcomerRegistered<T>>;
};

export class RegisterNewcomer {
  constructor(private readonly newcomerRepository: NewcomerRepository) {}

  private commentAction(form: RegisterForm, comment?: string) {
    if (comment === undefined) return form.clearComment();
    return form.fillComment(comment);
  }

  private nicknameAction(form: RegisterForm, nickname?: string) {
    if (nickname === undefined) return form.clearNickname();
    return form.fillNickname(nickname);
  }

  async fromRegisterForm(
    form: Partial<FulfilledRegistration>,
    membership: Membership,
  ) {
    const dataForm = this.commentAction(
      this.nicknameAction(RegisterForm.initFor(membership), form.nickname),
      form.comment,
    )
      .fillEmail(form.email ?? "")
      .fillFirstName(form.firstName ?? "")
      .fillLastName(form.lastName ?? "")
      .fillPassword(form.password ?? "")
      .fillMobilePhone(form.mobilePhone ?? "")
      .fillBirthDate(form.birthDate ?? new Date("1949-12-25"))
      .fillTeams(form.teams ?? []);
    const withEULA = form.hasApprovedEULA
      ? dataForm.approveEndUserLicenceAgreement()
      : dataForm.denyEndUserLicenceAgreement();
    const withVolunteerCharter = form?.hasSignedVolunteerCharter
      ? withEULA.signVolunteerCharter()
      : withEULA.denyVolunteerCharter();
    const fulfilledForm = withVolunteerCharter.complete();

    const isEmailAlreadyUsed = await this.newcomerRepository.isEmailUsed(
      fulfilledForm.email,
    );

    if (isEmailAlreadyUsed) {
      throw new RegistrationError([
        "L'email est déja utilisé par un autre utilisateur",
      ]);
    }

    return this.newcomerRepository.save(fulfilledForm, membership);
  }
}

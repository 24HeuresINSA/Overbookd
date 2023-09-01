import {
  FulfilledRegistration,
  RegisterForm,
  RegistrationError,
  Teams,
} from "./register-form";

export type Registree = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobilePhone: string;
  nickname?: string;
  birthdate: Date;
  comment?: string;
  teams: Teams;
};

export interface NewcomerRepository {
  isEmailUsed(email: string): Promise<boolean>;
  save: (fulfilledForm: FulfilledRegistration) => Promise<Registree>;
}

export class RegisterNewcomer {
  constructor(private readonly newcomerRepository: NewcomerRepository) {}

  async fromRegisterForm(form: Partial<FulfilledRegistration>) {
    const fulfilledForm = RegisterForm.init()
      .fillEmail(form.email ?? "")
      .fillFirstname(form.firstname ?? "")
      .fillLastname(form.lastname ?? "")
      .fillPassword(form.password ?? "")
      .fillMobilePhone(form.mobilePhone ?? "")
      .fillBirthdate(form.birthdate ?? new Date("1949-12-25"))
      .fillComment(form.comment ?? "")
      .fillTeams(form.teams ?? [])
      .fillNickname(form.nickname ?? "")
      .complete();

    const isEmailAlreadyUsed = await this.newcomerRepository.isEmailUsed(
      fulfilledForm.email,
    );

    if (isEmailAlreadyUsed) {
      throw new RegistrationError([
        "L'email est déja utilisé par un autre utilisateur",
      ]);
    }

    return this.newcomerRepository.save(fulfilledForm);
  }
}

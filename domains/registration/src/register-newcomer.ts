import { ENROLL_HARD, Permission } from "@overbookd/permission";

import { AdherentRegistered } from "./event";
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

export type FilterNotifyees = {
  permission: Permission;
};

export type Notifyee = {
  id: number;
};

export interface NotificationRepository {
  add(event: AdherentRegistered, clause: FilterNotifyees): Promise<Notifyee[]>;
}

export class RegisterNewcomer {
  constructor(
    private readonly newcomerRepository: NewcomerRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  private commentAction(form: RegisterForm, comment?: string) {
    if (comment === undefined) return form.clearComment();
    return form.fillComment(comment);
  }

  private nicknameAction(form: RegisterForm, nickname?: string) {
    if (nickname === undefined) return form.clearNickname();
    return form.fillNickname(nickname);
  }

  async fromRegisterForm(form: Partial<FulfilledRegistration>) {
    const fulfilledForm = this.commentAction(
      this.nicknameAction(RegisterForm.init(), form.nickname),
      form.comment,
    )
      .fillEmail(form.email ?? "")
      .fillFirstname(form.firstname ?? "")
      .fillLastname(form.lastname ?? "")
      .fillPassword(form.password ?? "")
      .fillMobilePhone(form.mobilePhone ?? "")
      .fillBirthdate(form.birthdate ?? new Date("1949-12-25"))
      .fillTeams(form.teams ?? [])
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

  notifyNewAdherentAwaits(newcomer: AdherentRegistered): Promise<Notifyee[]> {
    return this.notificationRepository.add(newcomer, {
      permission: ENROLL_HARD,
    });
  }
}

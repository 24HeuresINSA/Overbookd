import { ENROLL_HARD, ENROLL_SOFT, Permission } from "@overbookd/permission";

import {
  FulfilledRegistration,
  RegisterForm,
  RegistrationError,
} from "./register-form";
import {
  AdherentRegistered,
  Membership,
  NewcomerRegistered,
  VolunteerRegistered,
  MemberRegistered,
} from "./newcomer";

export interface NewcomerRepository {
  isEmailUsed(email: string): Promise<boolean>;
  save: <T extends Membership>(
    fulfilledForm: FulfilledRegistration,
    membership: T,
  ) => Promise<NewcomerRegistered<T>>;
}

export type FilterNotifyees = {
  permission: Permission;
};

export type Notifyee = {
  id: number;
};

export interface NotificationRepository {
  add(event: MemberRegistered, clause: FilterNotifyees): Promise<Notifyee[]>;
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

  async fromRegisterForm(
    form: Partial<FulfilledRegistration>,
    membership: Membership,
  ) {
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

    return this.newcomerRepository.save(fulfilledForm, membership);
  }

  notifyNewAdherentAwaits(newcomer: AdherentRegistered): Promise<Notifyee[]> {
    return this.notificationRepository.add(newcomer, {
      permission: ENROLL_HARD,
    });
  }

  notifyNewVolunteerAwaits(newcomer: VolunteerRegistered): Promise<Notifyee[]> {
    return this.notificationRepository.add(newcomer, {
      permission: ENROLL_SOFT,
    });
  }
}

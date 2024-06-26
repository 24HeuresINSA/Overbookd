import { type Membership, RegisterForm, STAFF } from "@overbookd/registration";
import type {
  EnrollableStaff,
  EnrollableVolunteer,
  HttpStringified,
} from "@overbookd/http";
import type { Credentials } from "@overbookd/registration";
import { updateItemToList } from "@overbookd/list";
import { RegistrationRepository } from "~/repositories/registration.repository";
import { castPeriodsWithDate } from "~/utils/http/period";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  staffs: EnrollableStaff[];
  volunteers: EnrollableVolunteer[];
  inviteStaffLink?: URL;
};

export const useRegistrationStore = defineStore("registration", {
  state: (): State => ({
    staffs: [],
    volunteers: [],
    inviteStaffLink: undefined,
  }),
  actions: {
    async getStaffs() {
      const res = await RegistrationRepository.getStaffs();
      if (isHttpError(res)) return;
      this.staffs = castStaffsWithDate(res);
    },

    async getVolunteers() {
      const res = await RegistrationRepository.getVolunteers();
      if (isHttpError(res)) return;
      this.volunteers = castVolunteersWithDate(res);
    },

    async fetchVolunteerInformation(volunteerId: EnrollableVolunteer["id"]) {
      const res = await RegistrationRepository.getVolunteer(volunteerId);
      if (isHttpError(res)) return;
      this._updateVolunteer(castVolunteerWithDate(res));
    },

    async enrollStaffs(staffs: EnrollableStaff[]) {
      const res = await RegistrationRepository.enrollStaffs(staffs);
      if (isHttpError(res)) return;
      sendNotification(
        "Les nouveaux arrivants sélectionnés ont bien été enrôlés en tant que hards ✅",
      );
      this._removeEnrolledNewcomers(staffs);
    },

    async enrollNewVolunteers(volunteers: EnrollableVolunteer[]) {
      const res = await RegistrationRepository.enrollNewVolunteers(volunteers);
      if (isHttpError(res)) return;
      sendNotification(
        "Le nouvel arrivant sélectionné a bien été enrôlé en tant que soft ✅",
      );
      this._removeEnrolledNewcomers(volunteers);
    },

    async fetchInviteStaffLink() {
      const res = await RegistrationRepository.fetchStaffLink();
      if (isHttpError(res)) return;
      this.inviteStaffLink = new URL(res);
    },

    async generateInviteStaffLink() {
      const res = await RegistrationRepository.generateStaffLink();
      if (isHttpError(res)) return;
      this.inviteStaffLink = new URL(res);
    },

    async register(form: RegisterForm, token?: string): Promise<boolean> {
      const res = await RegistrationRepository.registerNewcomer(form, token);
      if (isHttpError(res)) return false;
      sendNotification("Tu as bien été enregistré ✅");
      return true;
    },

    async forgetMe(credentials: Credentials, token: string) {
      const res = await RegistrationRepository.forgetMe(credentials, token);
      if (isHttpError(res)) return;
      sendNotification("Les informations liées à ce compte sont supprimées 🗑️");
    },

    async forget(membership: Membership, email: string) {
      const res = await RegistrationRepository.forgetHim(email);
      if (isHttpError(res)) return;
      if (membership === STAFF) await this.getStaffs();
      else await this.getVolunteers();
    },

    _updateVolunteer(volunteer: EnrollableVolunteer) {
      const volunteerIndex = this.volunteers.findIndex(
        ({ id }) => id === volunteer.id,
      );
      if (volunteerIndex === -1) return;
      this.volunteers = updateItemToList(
        this.volunteers,
        volunteerIndex,
        volunteer,
      );
    },

    _removeEnrolledNewcomers(enrolled: EnrollableStaff[]) {
      this.staffs = this.staffs.filter(
        (staff) =>
          !enrolled.some(
            (enrolledNewcomer) => enrolledNewcomer.id === staff.id,
          ),
      );
      this.volunteers = this.volunteers.filter(
        (volunteer) =>
          !enrolled.some(
            (enrolledNewcomer) => enrolledNewcomer.id === volunteer.id,
          ),
      );
    },
  },
});

function castStaffsWithDate(
  staffs: HttpStringified<EnrollableStaff[]>,
): EnrollableStaff[] {
  return staffs.map((staff) => ({
    ...staff,
    registeredAt: new Date(staff.registeredAt),
  }));
}

function castVolunteersWithDate(
  volunteers: HttpStringified<EnrollableVolunteer[]>,
): EnrollableVolunteer[] {
  return volunteers.map(castVolunteerWithDate);
}

function castVolunteerWithDate(
  volunteer: HttpStringified<EnrollableVolunteer>,
): EnrollableVolunteer {
  return {
    ...volunteer,
    registeredAt: new Date(volunteer.registeredAt),
    birthdate: new Date(volunteer.birthdate),
    availabilities: castPeriodsWithDate(volunteer.availabilities),
  };
}

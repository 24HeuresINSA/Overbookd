import { isHttpError } from "~/utils/http/http-error.utils";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import type {
  StaffCandidate,
  VolunteerCandidate,
  HttpStringified,
  StaffApplication,
} from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { castPeriodsWithDate } from "~/utils/http/period";

type State = {
  staffs: StaffCandidate[];
  rejectedStaffs: StaffCandidate[];
  volunteers: VolunteerCandidate[];
  inviteStaffLink?: URL;
};

export const useMembershipApplicationStore = defineStore(
  "membership-application",
  {
    state: (): State => ({
      staffs: [],
      rejectedStaffs: [],
      volunteers: [],
      inviteStaffLink: undefined,
    }),
    actions: {
      async applyAsStaff(candidate: StaffApplication) {
        const res =
          await MembershipApplicationRepository.applyAsStaff(candidate);
        if (isHttpError(res)) return;
        sendSuccessNotification("Ta demande pour devenir orga a été envoyée");
      },

      async rejectForStaff(candidateId: number) {
        const res =
          await MembershipApplicationRepository.rejectForStaff(candidateId);
        if (isHttpError(res)) return;
        sendSuccessNotification("La candidature a été rejetée");

        this.staffs = this.staffs.filter(({ id }) => id !== candidateId);

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchRecentStaffCandidates();
      },

      async cancelRejectionForStaff(candidateId: number) {
        const res =
          await MembershipApplicationRepository.cancelRejectionForStaff(
            candidateId,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("Le rejet de la candidature a été annulé");

        this.rejectedStaffs = this.rejectedStaffs.filter(
          ({ id }) => id !== candidateId,
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchRecentStaffCandidates();
      },

      async fetchStaffCandidates() {
        const res = await MembershipApplicationRepository.getStaffCandidates();
        if (isHttpError(res)) return;
        this.staffs = res;
      },

      async fetchRejectedStaffCandidates() {
        const res =
          await MembershipApplicationRepository.getRejectedStaffCandidates();
        if (isHttpError(res)) return;
        this.rejectedStaffs = res;
      },

      async fetchVolunteerCandidates() {
        const res =
          await MembershipApplicationRepository.getVolunteerCandidates();
        if (isHttpError(res)) return;
        this.volunteers = res.map(castVolunteerWithDate);
      },

      async fetchVolunteerCandidate(volunteerId: VolunteerCandidate["id"]) {
        const res =
          await MembershipApplicationRepository.getVolunteer(volunteerId);
        if (isHttpError(res)) return;
        this._updateVolunteer(castVolunteerWithDate(res));
      },

      async enrollStaffs(staffs: StaffCandidate[]) {
        const minimalStaffs = staffs.map(({ id }) => ({ id }));
        const res =
          await MembershipApplicationRepository.enrollStaffs(minimalStaffs);
        if (isHttpError(res)) return;
        sendSuccessNotification(
          "Les nouveaux arrivants sélectionnés ont été enrôlés en tant que hards",
        );
        this.staffs = this.staffs.filter(
          (staff) => !staffs.some(({ id }) => id === staff.id),
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchRecentStaffCandidates();
      },

      async enrollNewVolunteers(volunteers: VolunteerCandidate[]) {
        const res =
          await MembershipApplicationRepository.enrollNewVolunteers(volunteers);
        if (isHttpError(res)) return;
        sendSuccessNotification(
          "Le nouvel arrivant sélectionné a été enrôlé en tant que soft",
        );
        this.volunteers = this.volunteers.filter(
          (volunteer) => !volunteers.some(({ id }) => id === volunteer.id),
        );
      },

      async fetchInviteStaffLink() {
        const res = await MembershipApplicationRepository.fetchStaffLink();
        if (isHttpError(res)) return;
        this.inviteStaffLink = new URL(res);
      },

      async generateInviteStaffLink() {
        const res = await MembershipApplicationRepository.generateStaffLink();
        if (isHttpError(res)) return;
        this.inviteStaffLink = new URL(res);
      },

      _updateVolunteer(volunteer: VolunteerCandidate) {
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
    },
  },
);

function castVolunteerWithDate(
  volunteer: HttpStringified<VolunteerCandidate>,
): VolunteerCandidate {
  return {
    ...volunteer,
    registeredAt: new Date(volunteer.registeredAt),
    birthdate: new Date(volunteer.birthdate),
    availabilities: castPeriodsWithDate(volunteer.availabilities),
  };
}

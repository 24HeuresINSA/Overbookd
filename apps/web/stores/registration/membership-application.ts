import type {
  HttpStringified,
  StaffApplication,
  StaffCandidate,
  VolunteerCandidate,
} from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { toStandAloneUser } from "@overbookd/user";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import { castPeriodsWithDate } from "~/utils/http/cast-date/period.utils";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  staffCandidates: StaffCandidate[];
  rejectedStaffCandidates: StaffCandidate[];
  volunteerCandidates: VolunteerCandidate[];
  rejectedVolunteerCandidates: VolunteerCandidate[];
  inviteStaffLink?: URL;
};

export const useMembershipApplicationStore = defineStore(
  "membership-application",
  {
    state: (): State => ({
      staffCandidates: [],
      rejectedStaffCandidates: [],
      volunteerCandidates: [],
      rejectedVolunteerCandidates: [],
      inviteStaffLink: undefined,
    }),
    actions: {
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

      async submitStaffApplication(candidate: StaffApplication) {
        const res =
          await MembershipApplicationRepository.submitStaffApplication(
            candidate,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("Ta demande pour devenir orga a été envoyée");
      },

      async rejectStaffCandidate(candidateId: number) {
        const res =
          await MembershipApplicationRepository.rejectStaffCandidate(
            candidateId,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("La candidature a été rejetée");

        this.staffCandidates = this.staffCandidates.filter(
          ({ id }) => id !== candidateId,
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchStaffCandidates();
      },

      async cancelStaffCandidateRejection(candidateId: number) {
        const res =
          await MembershipApplicationRepository.cancelStaffCandidateRejection(
            candidateId,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("Le rejet de la candidature a été annulé");

        this.rejectedStaffCandidates = this.rejectedStaffCandidates.filter(
          ({ id }) => id !== candidateId,
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchStaffCandidates();
      },

      async fetchStaffCandidates() {
        const res = await MembershipApplicationRepository.getStaffCandidates();
        if (isHttpError(res)) return;
        this.staffCandidates = res.map(castStaffCandidateWithDate);
      },

      async fetchRejectedStaffCandidates() {
        const res =
          await MembershipApplicationRepository.getRejectedStaffCandidates();
        if (isHttpError(res)) return;
        this.rejectedStaffCandidates = res.map(castStaffCandidateWithDate);
      },

      async enrollNewStaffs(staffs: StaffCandidate[]) {
        const minimalStaffs = staffs.map(toStandAloneUser);
        const res =
          await MembershipApplicationRepository.enrollNewStaffs(minimalStaffs);
        if (isHttpError(res)) return;
        sendSuccessNotification(
          "Les candidats sélectionnés ont été enrôlés en tant que hards",
        );
        this.staffCandidates = this.staffCandidates.filter(
          (staff) => !staffs.some(({ id }) => id === staff.id),
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchStaffCandidates();
      },

      async submitVolunteerApplication(email: string) {
        const res =
          await MembershipApplicationRepository.submitVolunteerApplication(
            email,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification(
          "Ta demande pour devenir bénévole a été envoyée",
        );
      },

      async rejectVolunteerCandidate(candidateId: VolunteerCandidate["id"]) {
        const res =
          await MembershipApplicationRepository.rejectVolunteerCandidate(
            candidateId,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("La candidature a été rejetée");

        this.volunteerCandidates = this.volunteerCandidates.filter(
          ({ id }) => id !== candidateId,
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchVolunteerCandidates();
      },

      async cancelVolunteerCandidateRejection(
        candidateId: VolunteerCandidate["id"],
      ) {
        const res =
          await MembershipApplicationRepository.cancelVolunteerCandidateRejection(
            candidateId,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification("Le rejet de la candidature a été annulé");

        this.rejectedVolunteerCandidates =
          this.rejectedVolunteerCandidates.filter(
            ({ id }) => id !== candidateId,
          );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchVolunteerCandidates();
      },

      async fetchVolunteerCandidates() {
        const res =
          await MembershipApplicationRepository.getVolunteerCandidates();
        if (isHttpError(res)) return;
        this.volunteerCandidates = res.map(castVolunteerCandidateWithDate);
      },

      async fetchRejectedVolunteerCandidates() {
        const res =
          await MembershipApplicationRepository.getRejectedVolunteerCandidates();
        if (isHttpError(res)) return;
        this.rejectedVolunteerCandidates = res.map(
          castVolunteerCandidateWithDate,
        );
      },

      async enrollNewVolunteers(volunteers: VolunteerCandidate[]) {
        const minimalVolunteers = volunteers.map(toStandAloneUser);
        const res =
          await MembershipApplicationRepository.enrollNewVolunteers(
            minimalVolunteers,
          );
        if (isHttpError(res)) return;
        sendSuccessNotification(
          "Les candidats sélectionnés a été enrôlé en tant que soft",
        );
        this.volunteerCandidates = this.volunteerCandidates.filter(
          (volunteer) => !volunteers.some(({ id }) => id === volunteer.id),
        );

        const navigationBadgeStore = useNavigationBadgeStore();
        navigationBadgeStore.fetchVolunteerCandidates();
      },

      _updateVolunteer(volunteer: VolunteerCandidate) {
        const volunteerIndex = this.volunteerCandidates.findIndex(
          ({ id }) => id === volunteer.id,
        );
        if (volunteerIndex === -1) return;
        this.volunteerCandidates = updateItemToList(
          this.volunteerCandidates,
          volunteerIndex,
          volunteer,
        );
      },
    },
  },
);

function castStaffCandidateWithDate(
  staff: HttpStringified<StaffCandidate>,
): StaffCandidate {
  return {
    ...staff,
    candidatedAt: new Date(staff.candidatedAt),
  };
}

function castVolunteerCandidateWithDate(
  volunteer: HttpStringified<VolunteerCandidate>,
): VolunteerCandidate {
  return {
    ...volunteer,
    candidatedAt: new Date(volunteer.candidatedAt),
    birthdate: new Date(volunteer.birthdate),
    availabilities: castPeriodsWithDate(volunteer.availabilities),
  };
}

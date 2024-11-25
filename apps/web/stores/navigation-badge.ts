import {
  ENROLL_HARD,
  ENROLL_FESTIVAL_VOLUNTEER,
  READ_FA,
  type Permission,
} from "@overbookd/permission";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  myRefusedActivities: number;
  staffCandidates: number;
  volunteerCandidates: number;
};

export const useNavigationBadgeStore = defineStore("navigation-badge", {
  state: (): State => ({
    myRefusedActivities: 0,
    staffCandidates: 0,
    volunteerCandidates: 0,
  }),
  actions: {
    async fetchAll() {
      await this.fetchMyRefusedActivities();
      await this.fetchStaffCandidates();
      await this.fetchVolunteerCandidates();
    },

    async fetchMyRefusedActivities() {
      if (!this._hasPermission(READ_FA)) return;
      const res = await FestivalActivityRepository.getMyRefusalsCount();
      if (isHttpError(res)) return;
      this.myRefusedActivities = res;
    },

    async fetchStaffCandidates() {
      if (!this._hasPermission(ENROLL_HARD)) return;
      const res =
        await MembershipApplicationRepository.getStaffCandidatesCount();
      if (isHttpError(res)) return;
      this.staffCandidates = res;
    },

    async fetchVolunteerCandidates() {
      if (!this._hasPermission(ENROLL_FESTIVAL_VOLUNTEER)) return;
      const res =
        await MembershipApplicationRepository.getVolunteerCandidatesCount();
      if (isHttpError(res)) return;
      this.volunteerCandidates = res;
    },

    _hasPermission(permission: Permission) {
      const userStore = useUserStore();
      return userStore.can(permission);
    },
  },
});

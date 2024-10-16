import { ENROLL_HARD, READ_FA, type Permission } from "@overbookd/permission";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  myRefusedActivities: number;
  recentStaffNewcomers: number;
};

export const useNavigationBadgeStore = defineStore("navigation-badge", {
  state: (): State => ({
    myRefusedActivities: 0,
    recentStaffNewcomers: 0,
  }),
  actions: {
    async fetchAll() {
      await this.fetchMyRefusedActivities();
      await this.fetchRecentStaffCandidates();
    },

    async fetchMyRefusedActivities() {
      if (!this._hasPermission(READ_FA)) return;
      const res = await FestivalActivityRepository.getMyRefusalsCount();
      if (isHttpError(res)) return;
      this.myRefusedActivities = res;
    },

    async fetchRecentStaffCandidates() {
      if (!this._hasPermission(ENROLL_HARD)) return;
      const res =
        await MembershipApplicationRepository.getStaffCandidatesCount();
      if (isHttpError(res)) return;
      this.recentStaffNewcomers = res;
    },

    _hasPermission(permission: Permission) {
      const userStore = useUserStore();
      return userStore.can(permission);
    },
  },
});

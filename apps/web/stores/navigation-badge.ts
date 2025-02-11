import {
  ENROLL_HARD,
  ENROLL_SOFT,
  READ_FA,
  READ_FT,
  type Permission,
} from "@overbookd/permission";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import { FestivalTaskRepository } from "~/repositories/festival-event/festival-task.repository";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  myRefusedActivities: number;
  myRefusedTasks: number;
  staffCandidates: number;
  volunteerCandidates: number;
};

export const useNavigationBadgeStore = defineStore("navigation-badge", {
  state: (): State => ({
    myRefusedActivities: 0,
    myRefusedTasks: 0,
    staffCandidates: 0,
    volunteerCandidates: 0,
  }),
  actions: {
    async fetchAll() {
      await this.fetchMyRefusedActivities();
      await this.fetchMyRefusedTasks();
      await this.fetchStaffCandidates();
      await this.fetchVolunteerCandidates();
    },

    async fetchMyRefusedActivities() {
      if (!this._hasPermission(READ_FA)) return;
      const res = await FestivalActivityRepository.getMyRefusalsCount();
      if (isHttpError(res)) return;
      this.myRefusedActivities = res;
    },

    async fetchMyRefusedTasks() {
      if (!this._hasPermission(READ_FT)) return;
      const res = await FestivalTaskRepository.getMyRefusalsCount();
      if (isHttpError(res)) return;
      this.myRefusedTasks = res;
    },

    async fetchStaffCandidates() {
      if (!this._hasPermission(ENROLL_HARD)) return;
      const res =
        await MembershipApplicationRepository.getStaffCandidatesCount();
      if (isHttpError(res)) return;
      this.staffCandidates = res;
    },

    async fetchVolunteerCandidates() {
      if (!this._hasPermission(ENROLL_SOFT)) return;
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

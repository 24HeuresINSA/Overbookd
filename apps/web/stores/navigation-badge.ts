import { ENROLL_HARD, READ_FA, type Permission } from "@overbookd/permission";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  myRefusedActivities: number;
  unrenrolledStaffs: number;
};

export const useNavigationBadgeStore = defineStore("navigation-badge", {
  state: (): State => ({
    myRefusedActivities: 0,
    unrenrolledStaffs: 0,
  }),
  actions: {
    async fetchAll() {
      await this.fetchMyRefusedActivities();
      await this.fetchUnenrolledStaffs();
    },

    async fetchMyRefusedActivities() {
      if (!this._hasPermission(READ_FA)) return;
      const res = await FestivalActivityRepository.getMyRefusalsCount();
      if (isHttpError(res)) return;
      this.myRefusedActivities = res;
    },

    async fetchUnenrolledStaffs() {
      if (!this._hasPermission(ENROLL_HARD)) return;
      const res = await RegistrationRepository.getUnenrolledStaffsCount();
      if (isHttpError(res)) return;
      this.unrenrolledStaffs = res;
    },

    _hasPermission(permission: Permission) {
      const userStore = useUserStore();
      return userStore.can(permission);
    },
  },
});

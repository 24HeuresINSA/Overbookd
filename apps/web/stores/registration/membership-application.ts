import { isHttpError } from "~/utils/http/http-error.utils";
import { MembershipApplicationRepository } from "~/repositories/registration/membership-application.repository";
import type { StaffApplication } from "@overbookd/http";

export const useMembershipApplicationStore = defineStore(
  "membership-application",
  {
    actions: {
      async applyAsStaff(candidate: StaffApplication) {
        const res =
          await MembershipApplicationRepository.applyAsStaff(candidate);
        if (isHttpError(res)) return;
        sendSuccessNotification("Ta demande pour devenir orga a été envoyée");
      },
    },
  },
);

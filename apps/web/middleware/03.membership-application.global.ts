import { BE_AFFECTED } from "@overbookd/permission";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import { STAFF_APPLICATION_TOKEN_KEY } from "~/utils/registration/membership-application.utils";

export default defineNuxtRouteMiddleware(async (to) => {
  const oidc = useOidcAuth();
  if (!oidc.loggedIn.value) return;

  const membershipApplicationStore = useMembershipApplicationStore();

  const queryToken = stringifyQueryParam(to.query.token);
  const storageToken = localStorage.getItem(STAFF_APPLICATION_TOKEN_KEY);
  const staffToken = queryToken || storageToken;

  if (staffToken) {
    const hasStaffApplication =
      await membershipApplicationStore.hasCurrentStaffApplication();
    if (hasStaffApplication) return;
    membershipApplicationStore.submitStaffApplication(staffToken);
    return;
  }

  const myStore = useMyStore();
  if (myStore.can(BE_AFFECTED)) return;
  const hasVolunteerApplication =
    await membershipApplicationStore.hasCurrentVolunteerApplication();
  if (hasVolunteerApplication) return;
  membershipApplicationStore.submitVolunteerApplication();
});

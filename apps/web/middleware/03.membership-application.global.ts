import { needToBeLoggedIn } from "~/utils/pages/unauthenticated";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!needToBeLoggedIn(to)) return;

  const userStore = useUserStore();

  const email = userStore.loggedUser?.email;
  const token = stringifyQueryParam(to.query.token);
  if (!token || !email) return;

  const membershipApplicationStore = useMembershipApplicationStore();
  membershipApplicationStore.submitStaffApplication({ email, token });
  return to.path;
});

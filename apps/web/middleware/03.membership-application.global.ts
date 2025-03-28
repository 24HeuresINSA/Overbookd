import { needToBeLoggedIn } from "~/utils/navigation/pages/unauthenticated";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

export default defineNuxtRouteMiddleware((to) => {
  if (!needToBeLoggedIn(to)) return;

  const userStore = useUserStore();

  const email = userStore.loggedUser?.email;
  const token = stringifyQueryParam(to.query.token);
  if (!token || !email) return;

  const membershipApplicationStore = useMembershipApplicationStore();
  membershipApplicationStore.submitStaffApplication({ email, token });
  return to.path;
});

import { needToBeLoggedIn } from "~/utils/navigation/pages/unauthenticated";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!needToBeLoggedIn(to)) return;

  const userStore = useUserStore();

  const email = userStore.loggedUser?.email;
  const token = stringifyQueryParam(to.query.token);
  if (!token || !email) return;

  const membershipApplicationStore = useMembershipApplicationStore();
  membershipApplicationStore.applyAsStaff({ email, token });
  return to.path;
});

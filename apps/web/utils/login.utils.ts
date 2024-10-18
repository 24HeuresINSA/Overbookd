import type { Credentials } from "@overbookd/registration";
import { HOME_URL } from "@overbookd/web-page";

export async function loginAndApplyForMembership(
  credentials: Credentials,
  token?: string,
) {
  const authStore = useAuthStore();
  await authStore.login(credentials);
  if (!authStore.authenticated) return;
  navigateTo(HOME_URL);

  if (!token) return;
  const membershipApplicationStore = useMembershipApplicationStore();
  membershipApplicationStore.applyAsStaff({
    email: credentials.email,
    token,
  });
}

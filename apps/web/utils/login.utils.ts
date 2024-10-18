import { BE_AFFECTED } from "@overbookd/permission";
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

  const membershipApplicationStore = useMembershipApplicationStore();
  if (token) {
    membershipApplicationStore.submitStaffApplication({
      email: credentials.email,
      token,
    });
    return;
  }
  const userStore = useUserStore();
  if (userStore.can(BE_AFFECTED)) return;
  membershipApplicationStore.submitVolunteerApplication(credentials.email);
}

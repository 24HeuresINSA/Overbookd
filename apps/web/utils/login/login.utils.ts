import type { Credentials } from "@overbookd/registration";
import { BENEVOLE_CODE } from "@overbookd/team-constants";
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
  }
  const userStore = useUserStore();
  await userStore.fetchMyInformations();
  if (userStore.isMemberOf(BENEVOLE_CODE)) return;
  membershipApplicationStore.submitVolunteerApplication(credentials.email);
}

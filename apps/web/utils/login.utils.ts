import { BE_AFFECTED } from "@overbookd/permission";
import type { Credentials } from "@overbookd/registration";
import { HOME_URL } from "@overbookd/web-page";
import { playJauneAudio } from "./easter-egg/jaune-audio";

export async function loginAndApplyForMembership(
  credentials: Credentials,
  token?: string,
) {
  const authStore = useAuthStore();
  await authStore.login(credentials);
  if (!authStore.authenticated) return;

  await Promise.all([navigateTo(HOME_URL), playJauneAudio()]);

  applyForMembership(credentials.email, token);
}

async function applyForMembership(email: string, token?: string) {
  const membershipApplicationStore = useMembershipApplicationStore();
  if (token) {
    const hasApplication =
      await membershipApplicationStore.hasCurrentStaffApplication(email);
    if (hasApplication) return;
    membershipApplicationStore.submitStaffApplication({
      email,
      token,
    });
    return;
  }

  const userStore = useUserStore();
  if (userStore.can(BE_AFFECTED)) return;
  const hasApplication =
    await membershipApplicationStore.hasCurrentVolunteerApplication(email);
  if (hasApplication) return;
  membershipApplicationStore.submitVolunteerApplication(email);
}

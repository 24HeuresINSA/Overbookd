import { NuxtContext } from "./nuxt-context";

export default async function (context: NuxtContext) {
  if (context.store.$accessor.user.me?.email === undefined) {
    await Promise.all([
      context.store.$accessor.user.fetchUser(),
      context.store.$accessor.notification.fetchNotifications(),
    ]);
  }
}

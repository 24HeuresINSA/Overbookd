import { NuxtContext } from "./nuxt-context";

export default async function (context: NuxtContext) {
  if (context.store.$accessor.user.me?.email === undefined) {
    await context.store.$accessor.user.fetchUser();
  }
}

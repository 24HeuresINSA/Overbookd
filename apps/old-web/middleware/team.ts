import { NuxtContext } from "./nuxt-context";

export default async function (context: NuxtContext) {
  if (context.store.$accessor.team.allTeams.length === 0) {
    await context.store.$accessor.team.fetchTeams();
  }
}

export default async function (context) {
  if (context.store.$accessor.team.allTeams.length === 0) {
    await context.store.$accessor.team.setTeamsInStore();
  }
  if (context.store.$accessor.permission.allPermissions.length === 0) {
    await context.store.$accessor.permission.setPermissionsInStore();
  }
}

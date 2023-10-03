export const SELECT_NOTIFYEE = { id: true };

export function HAS_PERMISSION(permissionName: string) {
  return {
    teams: {
      some: {
        team: {
          permissions: { some: { permissionName } },
        },
      },
    },
  };
}

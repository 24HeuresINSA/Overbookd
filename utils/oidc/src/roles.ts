export const oidcRoles = {
  ADMIN: "overbookd_admin",
  USER: "overbookd_user",
} as const;

export type OidcRole = (typeof oidcRoles)[keyof typeof oidcRoles];

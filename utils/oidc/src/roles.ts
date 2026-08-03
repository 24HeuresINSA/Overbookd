export const oidcRoles = {
  ADMIN: "overbookd_admin",
  USER: "overbookd_user",
} as const;

export type OverbookdOidcRole = (typeof oidcRoles)[keyof typeof oidcRoles];

export const wikiOidcRoles = {
  EDITOR: "wiki_editor",
} as const;

export type WikiOidcRole = (typeof wikiOidcRoles)[keyof typeof wikiOidcRoles];

export const overviewOidcRoles = {
  VIEWER: "overview_viewer",
} as const;

export type OverviewOidcRole =
  (typeof overviewOidcRoles)[keyof typeof overviewOidcRoles];

export type OidcRole = OverbookdOidcRole | WikiOidcRole | OverviewOidcRole;

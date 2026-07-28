import { OidcRole } from "@overbookd/oidc";

export type ApiZitadelRoles = {
  id: string;
  details: {
    sequence: string;
    creationDate: string;
    changeDate: string;
    resourceOwner: string;
  };
  roleKeys: OidcRole[];
  state: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  orgId: string;
  orgName: string;
  orgDomain: string;
  projectId: string;
  projectName: string;
  preferredLoginName: string;
  userType: string;
  grantedOrgId: string;
  grantedOrgName: string;
  grantedOrgDomain: string;
};

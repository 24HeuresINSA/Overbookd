import { Permission } from "@overbookd/permission";

export type JwtPayload = {
  id: number;
  userId: number;
  teams: string[];
  permissions: Permission[];
};

export type RefreshJwt = {
  id: number;
  email: string;
};

export class JwtUtil implements JwtPayload {
  userId: number;
  id: number;
  teams: string[];
  permissions: Permission[];

  constructor(payload: JwtPayload) {
    this.userId = payload.userId;
    this.teams = payload.teams;
    this.permissions = payload.permissions;
    this.id = payload.id;
  }

  private get isAdmin(): boolean {
    return this.teams.includes("admin");
  }

  can(permission: Permission): boolean {
    return this.isAdmin || this.permissions.includes(permission);
  }
}

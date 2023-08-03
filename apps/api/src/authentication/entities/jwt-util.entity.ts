export type JwtPayload = {
  id: number;
  userId: number;
  teams: string[];
  permissions: string[];
};

export class JwtUtil implements JwtPayload {
  userId: number;
  id: number;
  teams: string[];
  permissions: string[];

  constructor(payload: JwtPayload) {
    this.userId = payload.userId;
    this.teams = payload.teams;
    this.permissions = payload.permissions;
    this.id = payload.id;
  }

  isAdmin(): boolean {
    return this.hasPermission('admin');
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}

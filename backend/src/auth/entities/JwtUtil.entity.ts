import { ApiProperty } from '@nestjs/swagger';

export class JwtUtil {
  constructor(payload: {
    userId: number;
    teams: string[];
    permissions: string[];
  }) {
    this.userId = payload.userId;
    this.teams = payload.teams;
    this.permissions = payload.permissions;
  }

  @ApiProperty({
    description: 'Id of the user',
  })
  userId: number;

  @ApiProperty({
    description: 'Teams of the user',
  })
  teams: string[];

  @ApiProperty({
    description: 'Permissions of the user',
  })
  permissions: string[];

  isAdmin(): boolean {
    return this.hasPermission('admin');
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  constructor(payload: { id: number; email: string; role: string[] }) {
    this.id = payload.id;
    this.email = payload.email;
    this.role = payload.role;
  }

  @ApiProperty({
    description: 'Id of the user',
  })
  id: number;

  @ApiProperty({
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    description: 'Roles of the user',
  })
  role: string[];

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  hasRole(role: string): boolean {
    return this.role.includes(role);
  }

  hasOneOfRequiredRoles(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.hasRole(role));
  }
}

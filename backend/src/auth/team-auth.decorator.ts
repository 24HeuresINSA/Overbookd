import { SetMetadata } from '@nestjs/common';

export const Permissions = (...teams: string[]) =>
  SetMetadata('permissions', teams);

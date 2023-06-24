import { FaStatus } from '@prisma/client';

export interface Animation {
  id: number;
  name: string;
  status: FaStatus;
}

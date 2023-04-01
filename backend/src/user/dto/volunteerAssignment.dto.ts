import { FtStatus } from '@prisma/client';
import { VolunteerTask } from '../user.service';

class FtRepresentation {
  id: number;
  name: string;
  status: FtStatus;
}

export class VolunteerAssignmentDto implements VolunteerTask {
  ft: FtRepresentation;
  start: Date;
  end: Date;
}

import { AssignedOnTask } from '../user.service';

class FtRepresentation {
  id: number;
  name: string;
}

export class VolunteerAssignmentDto implements AssignedOnTask {
  ft: FtRepresentation;
  start: Date;
  end: Date;
}

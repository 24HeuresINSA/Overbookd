import { CreateFaDto, Status } from './dto/create-fa.dto';
import { Security_pass_schedule } from '../security_pass/dto/create-security_pass.dto';

export const nakedFA: CreateFaDto = {
  FA: {
    name: 'Naked FA',
    type: 'test',
    team_id: 'hard',
    created_at: new Date(),
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'An FA wiht no links',
    is_publishable: true,
    is_major: false,
    is_kids: false,
    security_needs: 'string',
    water_flow_required: 0,
  },
  FA_Collaborators: [],
  Security_pass: [],
};

export const secuFA: CreateFaDto = {
  FA: {
    name: 'test',
    type: 'test',
    team_id: 'hard',
    created_at: new Date(),
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'string',
    is_publishable: true,
    is_major: false,
    is_kids: false,
    security_needs: 'string',
    water_flow_required: 0,
  },
  FA_Collaborators: [],
  Security_pass: [
    {
      name: 'Premier test',
      phone: '0707070707',
      license_plate: 'GC515EV',
      email: 'a@gmail.com',
      comment: 'no',
      entity: '24h',
      reason: 'fun',
      schedule: Security_pass_schedule.JOUR,
    },
  ],
};

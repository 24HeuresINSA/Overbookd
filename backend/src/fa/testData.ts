import { CreateFaDto, Status } from './dto/create-fa.dto';

export const nakedFA: CreateFaDto = {
  FA: {
    name: 'Naked FA',
    type: 'test',
    team_id: 1,
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'An FA wiht no links',
    is_publishable: true,
    is_major: false,
    is_kids: false,
  },
};
export const collaboratorFA: CreateFaDto = {
  FA: {
    name: 'Collaborator FA',
    type: 'test',
    team_id: 1,
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'An FA wiht no links',
    is_publishable: true,
    is_major: false,
    is_kids: false,
  },
  FA_Collaborators: [
    {
      firstname: 'Collaborator A',
      lastname: 'Collaborator A',
      phone: '0000000000',
    },
  ],
};

export const secuFA: CreateFaDto = {
  FA: {
    name: 'Secu FA',
    type: 'test',
    team_id: 1,
    created_at: new Date(),
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'string',
    is_publishable: true,
    is_major: false,
    is_kids: false,
    security_needs: 'A lot of security',
    water_flow_required: 12,
  },
  Security_pass: [
    {
      is_needed: true,
      number_of_pass: 1,
    },
  ],
};

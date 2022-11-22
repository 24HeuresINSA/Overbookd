import { UpdateFaDto, Status } from './dto/update-fa.dto';

export const emptyFA: UpdateFaDto = {
  fa: {
    name: 'empty',
  },
};

export const nakedFA: UpdateFaDto = {
  fa: {
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
export const collaboratorFA: UpdateFaDto = {
  fa: {
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
  fa_collaborator: [
    {
      firstname: 'Collaborator A',
      lastname: 'Collaborator A',
      phone: '0000000000',
    },
  ],
};

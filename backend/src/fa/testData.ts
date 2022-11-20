import { UpdateFaDto, Status } from './dto/update-fa.dto';

export const emptyFA: UpdateFaDto = {
  FA: {
    name: 'empty',
  },
};

export const nakedFA: UpdateFaDto = {
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
export const collaboratorFA: UpdateFaDto = {
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

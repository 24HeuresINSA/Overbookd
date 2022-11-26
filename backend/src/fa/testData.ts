import { UpdateFaDto, Status } from './dto/update-fa.dto';
import { signa_type } from '../fa_signa_needs/dto/create-fa_signa_need.dto';
import { subject_type } from '../fa_comment/dto/create-fa_comment.dto';

export const emptyFA: UpdateFaDto = {
  name: 'empty',
};

export const nakedFA: UpdateFaDto = {
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
};
export const collaboratorFA: UpdateFaDto = {
  name: 'Collaborator FA',
  type: 'test',
  team_id: 1,
  in_charge: 1,
  location_id: 1,
  status: Status.DRAFT,
  description: 'A FA with a Collaborator',
  is_publishable: true,
  is_major: false,
  is_kids: false,
  fa_collaborator: [
    {
      firstname: 'Collaborator A',
      lastname: 'Collaborator A',
      phone: '0000000000',
    },
  ],
};
export const signaFA: UpdateFaDto = {
  name: 'Signa FA',
  type: 'test',
  team_id: 1,
  in_charge: 1,
  location_id: 1,
  status: Status.DRAFT,
  description: 'A FA with some signa',
  is_publishable: true,
  is_major: false,
  is_kids: false,
  fa_signa_needs: [
    {
      signa_type: signa_type.BANNIERE,
      text: 'Bonjour',
      count: 1,
    },
  ],
};
export const commentFA: UpdateFaDto = {
  name: 'Signa FA',
  type: 'test',
  team_id: 1,
  in_charge: 1,
  location_id: 1,
  status: Status.DRAFT,
  description: 'A FA with some signa',
  is_publishable: true,
  is_major: false,
  is_kids: false,
  fa_comment: [
    {
      subject: subject_type.COMMENT,
      comment: 'Bonjour',
      author: 1,
      team_id: 1,
    },
  ],
};

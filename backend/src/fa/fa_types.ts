import { Prisma } from '@prisma/client';

export type FaResponse = Prisma.faGetPayload<{
  select: typeof COMPLETE_FA_SELECT;
}>;

export type AllFaResponse = Prisma.faGetPayload<{
  select: typeof ALL_FA_SELECT;
}>;

export const COMPLETE_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  team_id: true,
  in_charge: true,
  created_at: true,
  location_id: true,
  status: true,
  description: true,
  is_publishable: true,
  is_major: true,
  is_kids: true,
  security_needs: true,
  is_pass_required: true,
  number_of_pass: true,
  water_needs: true,
  water_flow_required: true,
  fa_collaborators: {
    select: {
      collaborator: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          phone: true,
          email: true,
          company: true,
          comment: true,
        },
      },
    },
  },
  fa_validation: {
    select: {
      User: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      Team: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
      created_at: true,
    },
  },
  fa_refuse: {
    select: {
      User: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      Team: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
      created_at: true,
    },
  },
  fa_electricity_needs: {
    select: {
      id: true,
      electricity_type: true,
      power: true,
      comment: true,
    },
  },
  fa_signa_needs: {
    select: {
      id: true,
      signa_type: true,
      text: true,
      count: true,
      comment: true,
    },
  },
  fa_comments: {
    select: {
      id: true,
      comment: true,
      subject: true,
      created_at: true,
      author: true,
      User_author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  },
  time_windows: {
    select: {
      id: true,
      start: true,
      end: true,
    },
  },
};

export const ALL_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  team_id: true,
  in_charge: true,
  created_at: true,
  location_id: true,
  status: true,
  description: true,
  is_publishable: true,
  is_major: true,
  is_kids: true,
  security_needs: true,
  is_pass_required: true,
  number_of_pass: true,
  water_needs: true,
  water_flow_required: true,
  is_deleted: true,
  user_in_charge: {
    select: {
      firstname: true,
      lastname: true,
    },
  },
  Team: {
    select: {
      name: true,
    },
  },
};

export const SELECT_GEAR = {
  id: true,
  name: true,
  isPonctualUsage: true,
  isConsumable: true,
  slug: true,
  category: {
    select: {
      id: true,
      name: true,
      path: true,
      owner: {
        select: {
          name: true,
          code: true,
        },
      },
    },
  },
};

export type DatabaseGear = {
  id: number;
  name: string;
  slug: string;
  category: {
    owner: {
      name: string;
      code: string;
    };
    id: number;
    name: string;
    path: string;
  };
  isPonctualUsage: boolean;
  isConsumable: boolean;
};

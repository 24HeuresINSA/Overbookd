export const SELECT_CATALOG_CATEGORY = {
  id: true,
  name: true,
  path: true,
  parent: true,
  owner: {
    select: {
      name: true,
      code: true,
    },
  },
};

export const SELECT_GEAR_WITH_OWNER = {
  slug: true,
  name: true,
  category: { select: { ownerCode: true } },
};

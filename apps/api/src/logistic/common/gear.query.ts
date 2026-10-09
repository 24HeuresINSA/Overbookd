import { CatalogGear, GearReferenceCodeGenerator } from "@overbookd/logistic";

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

export function convertGearToApiContract(gear: DatabaseGear): CatalogGear {
  const baseGear = {
    name: gear.name,
    slug: gear.slug,
    id: gear.id,
    isPonctualUsage: gear.isPonctualUsage,
    isConsumable: gear.isConsumable,
  };
  const category = gear.category
    ? {
        name: gear.category.name,
        path: gear.category.path,
        id: gear.category.id,
      }
    : undefined;
  const owner = gear.category?.owner
    ? { name: gear.category.owner.name, code: gear.category.owner.code }
    : undefined;
  const code = gear.category
    ? GearReferenceCodeGenerator.generate(gear.category, gear.id)
    : undefined;
  return { ...baseGear, category, owner, code };
}

export type GearSearchOptions = {
  name?: string;
  category?: string;
  owner?: string;
  ponctualUsage?: boolean;
};

export type CatalogGear = {
  id: number;
  name: string;
  isPonctualUsage: boolean;
  isConsumable: boolean;
  slug: string;
  owner?: {
    code: string;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    path: string;
  };
  code: string;
};

export type CatalogGearForm = {
  name: string;
  category?: number;
  isPonctualUsage: boolean;
  isConsumable: boolean;
};

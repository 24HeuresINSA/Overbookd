import { Team } from "./team.model";

export type Gear = {
  id: number;
  name: string;
  isPonctualUsage: boolean;
  isConsumable: boolean;
  slug: string;
  owner?: Pick<Team, "code" | "name">;
  category?: {
    id: number;
    name: string;
    path: string;
  };
  code: string;
};

type BaseCategory = {
  id: number;
  name: string;
  path: string;
  owner?: {
    code: string;
    name: string;
  };
};

export type CategoryTree = BaseCategory & {
  subCategories?: CategoryTree[];
};

export type Category = BaseCategory & {
  parent?: number;
};

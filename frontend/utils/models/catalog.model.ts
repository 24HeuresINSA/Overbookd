import { team } from "./repo";

export interface Gear {
  id: number;
  name: string;
  isPonctualUsage: boolean;
  slug: string;
  owner?: Pick<team, "code" | "name">;
  category?: {
    id: number;
    name: string;
    path: string;
  };
  code: string;
}

interface BaseCategory {
  id: number;
  name: string;
  path: string;
  owner?: {
    code: string;
    name: string;
  };
}

export interface CategoryTree extends BaseCategory {
  subCategories?: CategoryTree[];
}

export interface Category extends BaseCategory {
  parent?: number;
}

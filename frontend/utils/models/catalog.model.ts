export interface Gear {
  id: number;
  name: string;
  slug: string;
  category?: {
    id: number;
    name: string;
    path: string;
  };
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

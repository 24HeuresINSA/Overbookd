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

export interface Category {
  id: number;
  name: string;
  owner?: {
    code: string;
    name: string;
  };
}

export interface CategoryTree extends Category {
  subCategories?: CategoryTree[];
}

export type CategorySearchOptions = {
  name?: string;
  owner?: string;
};

export type CategoryForm = {
  name: string;
  owner?: string;
  parent?: number;
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

export type CatalogCategoryTree = BaseCategory & {
  subCategories?: CatalogCategoryTree[];
};

export type CatalogCategory = BaseCategory & {
  parent?: number;
};

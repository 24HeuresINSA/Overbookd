export type CategorySearchOptions = {
  name?: string;
  owner?: string;
};

export type CategoryForm = {
  name: string;
  owner?: string;
  parent?: number;
};

export type CategoryOwner = {
  code: string;
  name: string;
};

export type CatalogCategoryIdentifier = {
  id: number;
  name: string;
  path: string;
};

export type CatalogCategoryTree = CatalogCategoryIdentifier & {
  owner?: CategoryOwner;
  parent?: number;
  subCategories?: CatalogCategoryTree[];
};

export type CatalogCategory = CatalogCategoryIdentifier & {
  owner?: CategoryOwner;
  parent?: number;
};

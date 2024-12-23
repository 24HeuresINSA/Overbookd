import { SlugifyService } from "@overbookd/slugify";

export type Searchable<T> = T & { searchable: string };

export function matchingSearchItems<T>(
  searchableItems: Searchable<T>[],
  searchItem: string,
): T[] {
  const search = SlugifyService.apply(searchItem);
  return searchableItems.filter(({ searchable }) => {
    return searchable.includes(search);
  });
}

export function keepMatchingSearchCriteria<T>(
  search: string,
): (item: Searchable<T>) => boolean {
  const slugifiedSearch = SlugifyService.apply(search);
  return ({ searchable }) => searchable.includes(slugifiedSearch);
}

export function slugifiedFilter(itemFilterKey: string, typedSearch: string) {
  const search = SlugifyService.apply(typedSearch);
  return SlugifyService.apply(itemFilterKey).indexOf(search);
}

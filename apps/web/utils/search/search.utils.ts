import { SlugifyService } from "@overbookd/slugify";

export type Searchable<T> = T & { searchable: string }

export function matchingSearchItems<T>(
  searchableItems: Searchable<T>[],
  searchItem: string,
): T[] {
  const search = SlugifyService.apply(searchItem);
  return searchableItems.filter(({ searchable }) => {
    return searchable.includes(search);
  });
}

import { SlugifyService } from "@overbookd/slugify";

export type Searchable<T> = T & { searchable: string }

export function matchingSearchItems<T>(
  searchItem: string,
  searchableItems: Searchable<T>[]
): T[] {
  const search = SlugifyService.apply(searchItem);
  return searchableItems.filter(({ searchable }) => {
    return searchable.includes(search);
  });
}

import { SlugifyService } from "@overbookd/slugify";
import type { FilterMatch } from "vuetify";

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

export function slugifiedFilter(
  itemFilterKey: string,
  typedSearch: string,
): FilterMatch {
  const slugifiedKey = SlugifyService.apply(itemFilterKey);
  const searchWords = typedSearch
    .trim()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => SlugifyService.apply(word));

  const matches = searchWords.reduce<[number, number][]>((matches, word) => {
    const lastMatch = matches.at(-1);
    const startIndex = lastMatch ? lastMatch[1] : 0;
    const nextWordIndex =
      startIndex === 0 ? 0 : itemFilterKey.indexOf(" ", startIndex);
    const start = slugifiedKey.indexOf(word, nextWordIndex);
    matches.push([start, start + word.length]);
    return matches;
  }, []);

  const uniqueMatches = new Map(matches.map((match) => [match[0], match]));
  if (uniqueMatches.size !== searchWords.length || uniqueMatches.has(-1))
    return -1;

  const sortedMatches = [...uniqueMatches.values()].sort((a, b) => a[0] - b[0]);
  return sortedMatches;
}

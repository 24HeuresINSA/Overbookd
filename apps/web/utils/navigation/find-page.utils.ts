import { type Page, ALL_PAGES } from "./pages/summary-pages";

function removePathLastPart(path: string): string {
  return path.replace(/\/[^/]*$/, "");
}

export function findPage(path: string): Page | undefined {
  const pageWithExactPath = ALL_PAGES.find((page) => page.to === path);
  if (pageWithExactPath) return pageWithExactPath;

  const pagesWithParam = ALL_PAGES.filter((page) => page.hasParam);
  const reducedPath = removePathLastPart(path);

  return pagesWithParam.find((page) => page.to === reducedPath);
}

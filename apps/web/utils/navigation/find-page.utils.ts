import { type Page, All_PAGES } from "./pages/summary-pages";

function removePathLastPart(path: string): string {
  return path.replace(/\/[^/]*$/, "");
}

export function findPage(path: string): Page | undefined {
  const pageWithExactPath = All_PAGES.find((page) => page.to === path);
  if (pageWithExactPath) return pageWithExactPath;

  const pagesWithParam = All_PAGES.filter((page) => page.hasParam);
  const reducedPath = removePathLastPart(path);

  return pagesWithParam.find((page) => page.to === reducedPath);
}

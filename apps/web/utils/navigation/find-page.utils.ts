import { type Page, allPages } from "./pages/desktop-summary";

function removePathLastPart(path: string): string {
  return path.replace(/\/[^/]*$/, "");
}

export function findPage(path: string): Page | undefined {
  const pageWithExactPath = allPages.find((page) => page.to === path);
  if (pageWithExactPath) return pageWithExactPath;

  const pagesWithParam = allPages.filter((page) => page.hasParam);
  const reducedPath = removePathLastPart(path);

  return pagesWithParam.find((page) => page.to === reducedPath);
}

import { SlugifyService } from "@overbookd/slugify";
import type { PageInSummary } from "./navigation";

export class PageFilter {
  private readonly preferenceStore = usePreferenceStore();

  private constructor(private readonly pages: PageInSummary[]) {}

  static from(pages: PageInSummary[]): PageFilter {
    const userStore = useUserStore();
    const authorizedPages = pages.filter(
      (page) => !page.permission || userStore.can(page.permission),
    );
    return new PageFilter(authorizedPages);
  }

  matching(search?: string): PageInSummary[] {
    const slugifiedSearch = SlugifyService.applyOnOptional(search);
    if (!slugifiedSearch?.trim()) return this.pages;

    return this.pages.filter(({ keywords }) =>
      keywords.some((keyword) => keyword.includes(slugifiedSearch)),
    );
  }

  get favorites(): PageInSummary[] {
    return this.pages.filter(this.preferenceStore.isPageFavorite);
  }

  get nonFavorites(): PageInSummary[] {
    return this.pages.filter(
      (page) => !this.preferenceStore.isPageFavorite(page),
    );
  }

  get withMobileSupport(): PageInSummary[] {
    return this.pages.filter((page) => page.mobileSupport);
  }

  get all(): PageInSummary[] {
    return this.pages;
  }
}

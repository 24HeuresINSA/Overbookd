import {
  AssignmentPreference,
  DEFAULT_PREFERENCE,
  PagesPreference,
  PlanningPreference,
  Preference,
} from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { Preferences } from "../preference.service";
import { isPageURL, PageURL } from "@overbookd/web-page";

export class PrismaPreferences implements Preferences {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: number): Promise<Preference> {
    const dbPreference = await this.prisma.preference.findUnique({
      where: { userId },
      select: { paperPlanning: true, assignment: true, favoritePages: true },
    });
    if (!dbPreference) return DEFAULT_PREFERENCE;

    const pagesPreference = this.toPagePreference(dbPreference.favoritePages);
    return { ...dbPreference, ...pagesPreference };
  }

  async savePlanningPreference(
    userId: number,
    preference: PlanningPreference,
  ): Promise<PlanningPreference> {
    return this.prisma.preference.upsert({
      where: { userId },
      update: preference,
      create: { userId, ...preference },
      select: { paperPlanning: true },
    });
  }

  async saveAssignmentPreference(
    userId: number,
    preference: AssignmentPreference,
  ): Promise<AssignmentPreference> {
    return this.prisma.preference.upsert({
      where: { userId },
      update: preference,
      create: { userId, ...preference },
      select: { assignment: true },
    });
  }

  async addPageToFavorites(
    userId: number,
    page: PageURL,
  ): Promise<PagesPreference> {
    const { favoritePages } = await this.prisma.preference.upsert({
      where: { userId },
      update: { favoritePages: { push: page } },
      create: { userId, favoritePages: { set: [page] } },
      select: { favoritePages: true },
    });
    return this.toPagePreference(favoritePages);
  }

  async removePageFromFavorites(
    userId: number,
    page: PageURL,
  ): Promise<PagesPreference> {
    const currentPreferences = await this.prisma.preference.findUnique({
      where: { userId },
      select: { favoritePages: true },
    });
    if (!currentPreferences) return;

    const updatedFavoritePages = currentPreferences.favoritePages.filter(
      (favoritePage) => favoritePage !== page,
    );

    const { favoritePages } = await this.prisma.preference.upsert({
      where: { userId },
      update: { favoritePages: { set: updatedFavoritePages } },
      create: { userId, favoritePages: { set: updatedFavoritePages } },
      select: { favoritePages: true },
    });
    return this.toPagePreference(favoritePages);
  }

  private toPagePreference(pages: string[]): PagesPreference {
    return { favoritePages: pages.filter((page) => isPageURL(page)) };
  }
}

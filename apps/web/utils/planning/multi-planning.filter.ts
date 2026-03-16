import {
  stringifyArrayQueryParam,
  stringifyQueryParam,
} from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";
import { OverDate } from "@overbookd/time";
import type { User } from "@overbookd/user";

export type MultiPlanningParams = {
  volunteers?: User[];
  day?: Date;
  page?: number;
  itemsPerPage?: number;
};

export class MultiPlanningParamsBuilder {
  static getFromRouteQuery(query: LocationQuery): MultiPlanningParams {
    const volunteers = this.extractQueryParamsValue(query, "volunteers");
    const day = this.extractQueryParamsValue(query, "day");
    const page = this.extractQueryParamsValue(query, "page");
    const itemsPerPage = this.extractQueryParamsValue(query, "itemsPerPage");
    return { ...volunteers, ...day, ...page, ...itemsPerPage };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof MultiPlanningParams,
  ): MultiPlanningParams {
    switch (key) {
      case "volunteers": {
        const stringIds = stringifyArrayQueryParam(params.volunteerIds);
        const ids = stringIds.map(Number).filter((id) => !isNaN(id));
        const volunteers = this.toUsers(ids);
        return volunteers.length > 0 ? { volunteers } : {};
      }
      case "day": {
        const dayString = stringifyQueryParam(params.day);
        if (!dayString) return {};
        try {
          const localStartDate = new Date(dayString);
          const day = OverDate.fromLocal(localStartDate).date;
          return { day };
        } catch {
          return {};
        }
      }
      case "page": {
        const page = stringifyQueryParam(params.page);
        const isValid = page && !isNaN(+page);
        return isValid ? { page: +page } : {};
      }
      case "itemsPerPage": {
        const itemsPerPage = stringifyQueryParam(params.itemsPerPage);
        const isValid = itemsPerPage && !isNaN(+itemsPerPage);
        return isValid ? { itemsPerPage: +itemsPerPage } : {};
      }
    }
  }

  private static toUsers(ids: number[]): User[] {
    const userStore = useUserStore();
    return userStore.volunteers.filter(({ id }) => ids.includes(id));
  }
}

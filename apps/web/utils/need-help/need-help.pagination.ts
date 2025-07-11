import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";

export type NeedHelpPagination = {
  page?: number;
  itemsPerPage?: number;
};

export class NeedHelpPaginationBuilder {
  static getFromRouteQuery(query: LocationQuery): NeedHelpPagination {
    const page = this.extractQueryParamsValue(query, "page");
    const itemsPerPage = this.extractQueryParamsValue(query, "itemsPerPage");
    return { ...page, ...itemsPerPage };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof NeedHelpPagination,
  ): NeedHelpPagination {
    switch (key) {
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
}

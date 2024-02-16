import {
  GearDetails,
  GearPreview,
  GearSearchOptions,
  HttpStringified,
} from "@overbookd/http";
import { mutationTree, actionTree } from "typed-vuex";
import { LogisticDashboardRepository } from "~/repositories/logistic-dashboard.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  previews: GearPreview[];
  selectedGear?: GearWithDetails;
};

type GearWithDetails = {
  slug: string;
  details: GearDetails[];
};

export const state = (): State => ({
  previews: [],
  selectedGear: undefined,
});

export const mutations = mutationTree(state, {
  SET_PREVIEWS(state, previews: GearPreview[]) {
    state.previews = previews;
  },
  SET_SELECTED_GEAR(state, gear: GearWithDetails) {
    state.selectedGear = gear;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchPreviews(
      { commit },
      gearSearchOptions?: GearSearchOptions,
    ): Promise<void> {
      const res = await safeCall(
        this,
        LogisticDashboardRepository.getPreviews(this, gearSearchOptions),
      );
      if (!res) return;
      commit("SET_PREVIEWS", res.data);
    },

    async fetchDetails(
      { commit },
      { slug, start, end }: { slug: string; start: Date; end: Date },
    ): Promise<void> {
      const res = await safeCall(
        this,
        LogisticDashboardRepository.getDetails(this, slug, start, end),
      );
      if (!res) return;
      const gear = {
        slug,
        details: res.data.map(castGearDetailsWithDate),
      };
      commit("SET_SELECTED_GEAR", gear);
    },
  },
);

function castGearDetailsWithDate(
  details: HttpStringified<GearDetails>,
): GearDetails {
  return {
    ...details,
    start: new Date(details.start),
    end: new Date(details.end),
  };
}

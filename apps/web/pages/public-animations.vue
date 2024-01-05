<template>
  <div class="fa">
    <v-data-table :headers="headers" :items="animations">
      <template #body="{ items }">
        <tbody>
          <template v-for="animation in items">
            <tr :key="animation.id">
              <th class="status" :rowspan="animation.timeWindows.length + 1">
                <nuxt-link :to="`/fa/${animation.id}`">
                  <v-chip :class="animation.status.toLowerCase()" small>
                    {{ animation.id }}
                  </v-chip>
                </nuxt-link>
              </th>
              <th
                :rowspan="animation.timeWindows.length + 1"
                class="text-center"
              >
                <v-btn icon :href="animation.photoLink" target="_blank">
                  <v-icon large>mdi-camera</v-icon>
                </v-btn>
              </th>
              <td :rowspan="animation.timeWindows.length + 1">
                <div v-safe-html="animation.description" />
              </td>
              <td :rowspan="animation.timeWindows.length + 1">
                <v-chip-group column>
                  <v-chip
                    v-for="category in animation.categories"
                    :key="category"
                  >
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </td>
              <td
                :rowspan="animation.timeWindows.length + 1"
                class="text-center"
              >
                <v-icon v-if="animation.isFlagship" color="green" large>
                  mdi-check-circle
                </v-icon>
                <v-icon v-else color="red" large>mdi-close-circle</v-icon>
              </td>
            </tr>

            <tr
              v-for="(timeWindow, index) in sortTimeWindows(
                animation.timeWindows,
              )"
              :key="`${animation.id}-${timeWindow.start}-${timeWindow.end}-${index}`"
            >
              <td>
                {{ formatDateWithMinutes(timeWindow.start) }}
                <span>-</span>
                {{ formatDateWithMinutes(timeWindow.end) }}
              </td>
            </tr>
          </template>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PreviewForCommunication } from "@overbookd/http";
import { IProvidePeriod, Period } from "@overbookd/period";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";

interface PublicAnimationsData {
  headers: Header[];
}

export default Vue.extend({
  name: "PublicAnimations",
  data(): PublicAnimationsData {
    return {
      headers: [
        {
          text: "FA",
          value: "fa",
          width: "80px",
          sortable: false,
        },
        {
          text: "Photo",
          value: "photoLink",
          align: "center",
          width: "80px",
          sortable: false,
        },
        { text: "Description", value: "description", sortable: false },
        { text: "Catégories", value: "categories", sortable: false },
        {
          text: "Anim phare",
          value: "isMajor",
          align: "center",
          width: "100px",
          sortable: false,
        },
        { text: "Créneaux", value: "timeWindows", sortable: false },
      ],
    };
  },
  head: () => ({
    title: "Animations à publier",
  }),
  computed: {
    animations(): PreviewForCommunication[] {
      return this.$accessor.festivalActivity.activities.forCommunication;
    },
  },
  mounted() {
    this.$accessor.festivalActivity.fetchCommunicationPreviews();
  },
  methods: {
    formatDateWithMinutes,
    sortTimeWindows(periods: IProvidePeriod[]): IProvidePeriod[] {
      const initPeriods = periods.map((period) => Period.init(period));
      return Period.sort(initPeriods);
    },
  },
});
</script>

<template>
  <div>
    <v-data-table :headers="headers" :items="animations">
      <template #body="{ items }">
        <tbody>
          <template v-for="animation in items">
            <tr :key="animation.id">
              <th :rowspan="animation.timeWindows.length + 1">
                <nuxt-link :to="`/fa/${animation.id}`" class="name-text">
                  <v-chip-group>
                    <v-chip small>{{ animation.id }}</v-chip>
                  </v-chip-group>
                  <v-label> - {{ animation.name }}</v-label>
                </nuxt-link>
              </th>
              <th
                :rowspan="animation.timeWindows.length + 1"
                class="text-center"
              >
                <v-btn
                  v-show="animation.photoLink"
                  icon
                  :href="animation.photoLink"
                  target="_blank"
                >
                  <v-icon large>mdi-camera</v-icon>
                </v-btn>
              </th>
              <td :rowspan="animation.timeWindows.length + 1">
                {{ animation.description }}
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
              v-for="timeWindow in sortTimeWindows(animation.timeWindows)"
              :key="timeWindow.id"
            >
              <td class="text-start">
                {{ formatDateWithMinutes(timeWindow.start) }}
                <span class="font-weight-bold">-</span>
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
import { defineComponent } from "vue";
import { PreviewForCommunication } from "@overbookd/http";
import { IProvidePeriod, Period } from "@overbookd/period";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";

interface PublicAnimationsData {
  headers: Header[];
}

export default defineComponent({
  name: "PublicAnimations",
  data(): PublicAnimationsData {
    return {
      headers: [
        { text: "FA", value: "fa" },
        { text: "Photo", value: "photoLink", align: "center" },
        { text: "Description", value: "description" },
        { text: "Catégories", value: "categories" },
        { text: "Anim phare", value: "isMajor", align: "center" },
        { text: "Créneaux", value: "timeWindows" },
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

<style lang="scss" scoped>
.name-text {
  text-decoration: none;
  display: flex;
  align-items: center;

  .v-label {
    cursor: pointer;
  }
}
</style>

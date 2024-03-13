<template>
  <div>
    <v-data-table :headers="headers" :items="animations">
      <template #body="{ items }">
        <tbody>
          <template v-for="activity in items">
            <tr :key="activity.id">
              <th class="fa" :rowspan="activity.timeWindows.length + 1">
                <nuxt-link :to="`/fa/${activity.id}`" class="fa__link">
                  <v-chip-group class="status">
                    <v-chip :class="activity.status.toLowerCase()" small>
                      {{ activity.id }}
                    </v-chip>
                  </v-chip-group>
                  <v-label> - {{ activity.name }}</v-label>
                </nuxt-link>
              </th>
              <th
                :rowspan="activity.timeWindows.length + 1"
                class="text-center"
              >
                <v-btn icon :href="activity.photoLink" target="_blank">
                  <v-icon large>mdi-camera</v-icon>
                </v-btn>
              </th>
              <td :rowspan="activity.timeWindows.length + 1">
                <div v-safe-html="activity.description" />
              </td>
              <td :rowspan="activity.timeWindows.length + 1">
                <v-chip-group column>
                  <v-chip
                    v-for="category in activity.categories"
                    :key="category"
                  >
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </td>
              <td
                :rowspan="activity.timeWindows.length + 1"
                class="text-center"
              >
                <v-icon v-if="activity.isFlagship" color="green" large>
                  mdi-check-circle
                </v-icon>
                <v-icon v-else color="red" large>mdi-close-circle</v-icon>
              </td>
            </tr>

            <tr
              v-for="timeWindow in sortTimeWindows(activity.timeWindows)"
              :key="timeWindow.id"
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
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import { TimeWindow } from "@overbookd/festival-event";
import { Period } from "@overbookd/period";

type PublicAnimationsData = {
  headers: Header[];
};

export default Vue.extend({
  name: "PublicAnimations",
  data(): PublicAnimationsData {
    return {
      headers: [
        {
          text: "FA",
          value: "fa",
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
    sortTimeWindows(timeWindows: TimeWindow[]): TimeWindow[] {
      return Period.sort([...timeWindows]);
    },
  },
});
</script>

<style lang="scss" scoped>
.fa {
  &__link {
    text-decoration: none;
    display: flex;
    align-items: center;

    .v-label {
      cursor: pointer;
    }
  }
}
</style>

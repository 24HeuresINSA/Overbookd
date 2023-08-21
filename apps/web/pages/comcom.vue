<template>
  <div>
    <v-data-table :headers="headers" :items="publicAnimations">
      <template #body="{ items }">
        <tbody>
          <template v-for="publicAnimation in items">
            <tr :key="publicAnimation.fa.id">
              <th :rowspan="publicAnimation.fa.timeWindows.length + 1">
                <nuxt-link
                  :to="`/fa/${publicAnimation.fa.id}`"
                  class="name-text"
                >
                  <v-chip-group>
                    <v-chip small>{{ publicAnimation.fa.id }}</v-chip>
                  </v-chip-group>
                  <v-label> - {{ publicAnimation.fa.name }}</v-label>
                </nuxt-link>
              </th>
              <th
                :rowspan="publicAnimation.fa.timeWindows.length + 1"
                class="text-center"
              >
                <v-btn
                  v-show="publicAnimation.photoLink"
                  icon
                  :href="publicAnimation.photoLink"
                  target="_blank"
                >
                  <v-icon large>mdi-camera</v-icon>
                </v-btn>
              </th>
              <td :rowspan="publicAnimation.fa.timeWindows.length + 1">
                {{ publicAnimation.description }}
              </td>
              <td :rowspan="publicAnimation.fa.timeWindows.length + 1">
                <v-chip-group column>
                  <v-chip
                    v-for="category in publicAnimation.categories"
                    :key="category"
                  >
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </td>
              <td
                :rowspan="publicAnimation.fa.timeWindows.length + 1"
                class="text-center"
              >
                <v-icon v-if="publicAnimation.isMajor" color="green" large>
                  mdi-check-circle
                </v-icon>
                <v-icon v-else color="red" large>mdi-close-circle</v-icon>
              </td>
            </tr>

            <tr
              v-for="timeWindow in sortTimeWindows(
                publicAnimation.fa.timeWindows
              )"
              :key="timeWindow.id"
            >
              <td class="text-start">
                {{ formatDate(timeWindow.start) }}
                <span class="font-weight-bold">-</span>
                {{ formatDate(timeWindow.end) }}
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
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/dataTable";
import { PublicAnimationWithFa } from "~/utils/models/fa";
import { PeriodWithId } from "~/utils/models/period";

interface Comcom {
  headers: Header[];
}

export default Vue.extend({
  name: "Comcom",
  data(): Comcom {
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
    publicAnimations(): PublicAnimationWithFa[] {
      return this.$accessor.publicAnimation.publicAnimations;
    },
  },
  async beforeMount() {
    this.$accessor.publicAnimation.fetchAllPublicAnimations();
  },
  methods: {
    formatDate(date: Date): string {
      return formatDateWithMinutes(date);
    },
    sortTimeWindows(timeWindows: PeriodWithId[]): PeriodWithId[] {
      const sortedTimeWindows = [...timeWindows].sort((a, b) => {
        if (a.start === b.start) {
          return a.end.getTime() - b.end.getTime();
        }
        return a.start.getTime() - b.start.getTime();
      });
      return sortedTimeWindows;
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

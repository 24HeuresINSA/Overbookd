<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #body="{ items }">
        <tbody>
          <template v-for="publishAnimation in items">
            <tr>
              <th :rowspan="publishAnimation.fa.timeWindows.length + 1">
                <nuxt-link
                  :to="`/fa/${publishAnimation.fa.id}`"
                  class="name-text"
                >
                  <v-chip-group>
                    <v-chip small>{{ publishAnimation.fa.id }}</v-chip>
                  </v-chip-group>
                  <v-label> - {{ publishAnimation.fa.name }}</v-label>
                </nuxt-link>
              </th>
              <th
                :rowspan="publishAnimation.fa.timeWindows.length + 1"
                class="text-center"
              >
                <v-btn icon :href="publishAnimation.photoLink" target="_blank">
                  <v-icon large>mdi-camera</v-icon>
                </v-btn>
              </th>
              <td :rowspan="publishAnimation.fa.timeWindows.length + 1">
                {{ publishAnimation.description }}
              </td>
              <td :rowspan="publishAnimation.fa.timeWindows.length + 1">
                <v-chip-group column>
                  <v-chip
                    v-for="category in publishAnimation.categories"
                    :key="category"
                  >
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </td>
              <td
                :rowspan="publishAnimation.fa.timeWindows.length + 1"
                class="text-center"
              >
                <v-icon v-if="publishAnimation.isMajor" color="green" large>
                  mdi-check-circle
                </v-icon>
                <v-icon v-else color="red" large>mdi-close-circle</v-icon>
              </td>
            </tr>

            <tr
              v-for="timeWindow in sortTimeWindows(
                publishAnimation.fa.timeWindows
              )"
              :key="`${timeWindow.start}-${timeWindow.end}`"
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
import { Header } from "~/utils/models/Data";
import { SitePublishAnimationWithFa } from "~/utils/models/FA";
import { Period } from "~/utils/models/period";

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
  computed: {
    publishAnimations(): SitePublishAnimationWithFa[] {
      return this.$accessor.publishAnimation.publishAnimations;
    },
  },
  async beforeMount() {
    this.$accessor.publishAnimation.fetchAllPublishAnimations();
  },
  methods: {
    formatDate(date: Date): string {
      return formatDateWithMinutes(date);
    },
    sortTimeWindows(timeWindows: Period[]): Period[] {
      const sortedTimeWindows = [...timeWindows].sort((a, b) => {
        if (a.start === b.start) {
          return new Date(a.end).getTime() - new Date(b.end).getTime();
        }
        return new Date(a.start).getTime() - new Date(b.start).getTime();
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

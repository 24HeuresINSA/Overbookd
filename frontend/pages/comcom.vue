<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #body="{ items }">
        <tbody>
          <template v-for="publishAnimation in items">
            <tr>
              <th :rowspan="publishAnimation.fa.timeWindows.length + 1">
                <v-chip-group>
                  <v-chip small>{{ publishAnimation.fa.id }}</v-chip>
                </v-chip-group>
              </th>
              <td :rowspan="publishAnimation.fa.timeWindows.length + 1">
                <nuxt-link :to="`/fa/${publishAnimation.fa.id}`">
                  {{ publishAnimation.fa.name }}
                </nuxt-link>
              </td>
              <th :rowspan="publishAnimation.fa.timeWindows.length + 1">
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
              v-for="timeWindow in publishAnimation.fa.timeWindows"
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

interface Comcom {
  headers: Header[];
}

export default Vue.extend({
  name: "Comcom",
  data(): Comcom {
    return {
      headers: [
        { text: "Numéro", value: "faId" },
        { text: "Nom", value: "name" },
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
  },
});
</script>

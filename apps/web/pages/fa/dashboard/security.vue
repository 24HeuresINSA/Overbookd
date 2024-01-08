<template>
  <div class="security-dashboard">
    <h1>Récapitulatif Sécurité</h1>
    <v-data-table :headers="headers" :items="activities">
      <template #item.festivalActivity="{ item }">
        {{ item.id }} - {{ item.name }}
      </template>
      <template #item.team="{ item }">
        <TeamChip v-if="item.team" :team="item.team" with-name />
      </template>
      <template #item.startingTimeWindow="{ item }">
        {{ displayDate(startingTimeWindow(item.timeWindows)) }}
      </template>
      <template #item.endingTimeWindow="{ item }">
        {{ displayDate(endingTimeWindow(item.timeWindows)) }}
      </template>
      <template #item.timeWindowsCount="{ item }">
        {{ item.timeWindows.length }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { PreviewForSecurity } from "@overbookd/http";
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";

type SecurityData = {
  headers: Header[];
};

export default defineComponent({
  name: "SecurityDashboard",
  components: { TeamChip },
  data: (): SecurityData => ({
    headers: [
      {
        text: "Fiche Activité",
        value: "festivalActivity",
        sortable: false,
        width: "300px",
      },
      { text: "Equipe responsable", value: "team", sortable: false },
      {
        text: "Début du premier créneau",
        value: "startingTimeWindow",
        sortable: false,
        width: "175px",
      },
      {
        text: "Fin du dernier créneau",
        value: "endingTimeWindow",
        sortable: false,
        width: "160px",
      },
      { text: "Créneaux", value: "timeWindowsCount", sortable: false },
      {
        text: "Dispositif de sécurité",
        value: "specialNeeds",
        sortable: false,
      },
      { text: "Laissez-passer", value: "freePass", sortable: false },
    ],
  }),
  computed: {
    activities(): PreviewForSecurity[] {
      return this.$accessor.festivalActivity.activities.forSecurity;
    },
  },
  mounted() {
    if (this.activities.length !== 0) return;
    this.$accessor.festivalActivity.fetchSecurityPreviews();
  },
  methods: {
    displayDate(date: Date): string {
      return formatDateToHumanReadable(date);
    },
    endingTimeWindow(timeWindows: PreviewForSecurity["timeWindows"]) {
      const ends = timeWindows.map(({ end }) => end);
      const maxTimestamp = Math.max(...ends.map((end) => end.getTime()));
      return new Date(maxTimestamp);
    },
    startingTimeWindow(timeWindows: PreviewForSecurity["timeWindows"]) {
      const starts = timeWindows.map(({ start }) => start);
      const minTimestamp = Math.min(...starts.map((end) => end.getTime()));
      return new Date(minTimestamp);
    },
  },
});
</script>

<style lang="scss">
.time-windows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .time-window {
    display: flex;
    gap: 30px;
    .temporal {
      font-weight: 600;
    }
    .date {
      margin-left: 5px;
    }
  }
}
</style>

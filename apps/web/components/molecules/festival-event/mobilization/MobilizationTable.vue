<template>
  <v-data-table
    :headers="headers"
    :items="selectedTask.mobilizations"
    :items-per-page="-1"
    disable-pagination
    hide-default-footer
  ></v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Header } from "~/utils/models/data-table.model";
import { FestivalTask } from "@overbookd/festival-event";

type MobilizationTableData = {
  headers: Header[];
};

export default defineComponent({
  name: "MobilizationTable",
  data(): MobilizationTableData {
    return {
      headers: [
        { text: "Début", value: "name" },
        { text: "Fin", value: "date" },
        { text: "Découpage", value: "durationSplitInHour" },
        { text: "Bénévoles requis", value: "volunteers" },
        { text: "Equipes requises", value: "teams" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  computed: {
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
  },
});
</script>

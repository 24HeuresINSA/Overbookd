<template>
  <v-card>
    <v-card-title> Moblisations </v-card-title>

    <v-card-text>
      <MobilizationTable @add="addMobilization" @remove="removeMobilization" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MobilizationTable from "~/components/molecules/festival-event/mobilization/MobilizationTable.vue";
import { Mobilization } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";

export default defineComponent({
  name: "MobilizationCard",
  components: { MobilizationTable },
  methods: {
    addMobilization(mobilization: AddMobilizationForm) {
      this.$accessor.festivalTask.addMobilization(mobilization);
    },
    removeMobilization(mobilization: Mobilization) {
      this.$accessor.festivalTask.removeMobilization(mobilization.id);
    },
  },
});
</script>

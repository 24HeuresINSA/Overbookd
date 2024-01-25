<template>
  <v-card>
    <v-card-title> Moblisations </v-card-title>

    <v-card-text>
      <MobilizationTable />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MobilizationTable from "~/components/molecules/festival-event/mobilization/MobilizationTable.vue";

export default defineComponent({
  name: "MobilizationCard",
  components: { MobilizationTable },
});
</script>

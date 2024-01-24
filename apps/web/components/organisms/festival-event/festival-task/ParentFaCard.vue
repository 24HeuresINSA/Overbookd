<template>
  <v-card class="ft">
    <v-card-title>FA associée</v-card-title>

    <v-card-text>
      <v-chip-group id="status">
        <v-chip
          v-if="festivalActivity"
          :href="`/fa/${festivalActivity.id}`"
          :class="festivalActivity.status.toLowerCase()"
          :ripple="false"
          :disabled="!festivalActivity"
        >
          {{ festivalActivity.id }} - {{ festivalActivity.name }}
        </v-chip>
      </v-chip-group>

      <h2>Créneaux de l'activité</h2>
      <FaTimeWindowTable
        :time-windows="festivalActivity.timeWindows"
        disabled
        dense
      />

      <h2>Créneaux du matos</h2>
      <FaTimeWindowTable
        :time-windows="festivalActivity.inquiry.timeWindows"
        disabled
        dense
      />

      <h2>Demandes de matos</h2>
      <InquiryTable :inquiries="festivalActivity.inquiry.all" disabled dense />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import { FestivalTask } from "@overbookd/festival-event";

export default defineComponent({
  name: "ParentFaCard",
  components: { FaTimeWindowTable, InquiryTable },
  computed: {
    festivalActivity(): FestivalTask["festivalActivity"] {
      return this.$accessor.festivalTask.selectedTask.festivalActivity;
    },
  },
});
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
  margin: 25px 0 10px 0;
}
</style>

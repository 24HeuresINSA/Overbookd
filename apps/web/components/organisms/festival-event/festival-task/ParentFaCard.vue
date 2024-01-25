<template>
  <v-card class="ft">
    <v-card-title>FA associée</v-card-title>

    <v-card-text>
      <v-chip-group id="status">
        <v-chip
          :href="`/fa/${festivalActivity.id}`"
          :class="festivalActivity.status.toLowerCase()"
          :ripple="false"
          :disabled="!festivalActivity"
        >
          {{ festivalActivity.id }} - {{ festivalActivity.name }}
        </v-chip>
      </v-chip-group>

      <h3>Déroulement de l'activité</h3>
      <FaTimeWindowTable
        :time-windows="festivalActivity.timeWindows"
        disabled
      />

      <h3>Demandes de matos</h3>
      <FaTimeWindowTable
        :time-windows="festivalActivity.inquiry.timeWindows"
        disabled
      />

      <InquiryTable
        :inquiries="festivalActivity.inquiry.all"
        :owner="MATOS"
        disabled
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import { FestivalTask, MATOS } from "@overbookd/festival-event";

type ParentFaCardData = {
  MATOS: typeof MATOS;
};

export default defineComponent({
  name: "ParentFaCard",
  components: { FaTimeWindowTable, InquiryTable },
  data: (): ParentFaCardData => ({
    MATOS,
  }),
  computed: {
    festivalActivity(): FestivalTask["festivalActivity"] {
      return this.$accessor.festivalTask.selectedTask.festivalActivity;
    },
  },
});
</script>

<style lang="scss" scoped>
h3 {
  font-size: 1.1rem;
  margin: 25px 0 10px 0;
}
</style>

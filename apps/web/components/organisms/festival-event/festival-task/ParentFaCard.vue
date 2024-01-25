<template>
  <v-card class="ft">
    <v-card-title>FA associée</v-card-title>

    <v-card-text>
      <NuxtLink :to="`/fa/${festivalActivity.id}`" class="festival-activity">
        <v-chip-group id="status">
          <v-chip :class="festivalActivity.status.toLowerCase()">
            {{ festivalActivity.id }}
          </v-chip>
        </v-chip-group>
        <h2 class="festival-activity__name">{{ festivalActivity.name }}</h2>
        <v-icon>mdi-open-in-new</v-icon>
      </NuxtLink>

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
.festival-activity {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  width: fit-content;
  &__name {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.8);
  }
}

h3 {
  font-size: 1.1rem;
  margin: 25px 0 10px 0;
}
</style>

<template>
  <v-card class="ft">
    <v-card-title>FA associée</v-card-title>

    <v-card-text>
      <NuxtLink :to="`${FA_URL}/${activity.id}`" class="activity">
        <v-chip-group id="status">
          <v-chip :class="activity.status.toLowerCase()">
            {{ activity.id }}
          </v-chip>
        </v-chip-group>
        <h2 class="festival-activity__name">{{ activity.name }}</h2>
        <v-icon>mdi-open-in-new</v-icon>
      </NuxtLink>

      <span v-show="activity.location">
        <v-icon>mdi-map</v-icon>
        {{ activity.location?.name }}
      </span>

      <h3>Déroulement de l'activité</h3>
      <FaTimeWindowTable :time-windows="activity.timeWindows" disabled />

      <h3>Demandes de matos</h3>
      <FaTimeWindowTable
        :time-windows="activity.inquiry.timeWindows"
        disabled
      />

      <InquiryTable
        :inquiries="activity.inquiry.all"
        :time-windows="activity.inquiry.timeWindows"
        :owner="MATOS"
        disabled
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { type FestivalTask, MATOS } from "@overbookd/festival-event";
import { FA_URL } from "@overbookd/web-page";

const ftStore = useFestivalTaskStore();
const activity = computed<FestivalTask["festivalActivity"]>(
  () => ftStore.selectedTask.festivalActivity,
);
</script>

<style lang="scss" scoped>
.activity {
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

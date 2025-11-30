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
        <v-icon>mdi-map-marker-radius</v-icon>
        {{ activity.location?.name }}
      </span>

      <div class="time-windows-title">
        <h3>Créneaux de l'activité</h3>
        <v-btn
          icon="mdi-calendar-blank"
          aria-label="Ouvrir le planning"
          title="Ouvrir le planning"
          color="secondary"
          rounded="pill"
          density="comfortable"
          @click="openCalendar"
        />
      </div>
      <FaTimeWindowTable :time-windows="activity.timeWindows" disabled />

      <div class="time-windows-title">
        <h3>Demandes de matos</h3>
        <v-btn
          icon="mdi-calendar-blank"
          aria-label="Ouvrir le planning"
          title="Ouvrir le planning"
          color="secondary"
          rounded="pill"
          density="comfortable"
          @click="openCalendar"
        />
      </div>
      <FaTimeWindowTable
        :time-windows="activity.inquiry.timeWindows"
        disabled
      />

      <InquiryTable
        :inquiries="activity.inquiry.all"
        :time-windows="activity.inquiry.timeWindows"
        :owner="LOG_MATOS"
        disabled
        @link-drive="linkDrive"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { AssignDrive, FestivalTask } from "@overbookd/festival-event";
import { LOG_MATOS } from "@overbookd/team-constants";
import { FA_URL } from "@overbookd/web-page";

const ftStore = useFestivalTaskStore();
const faStore = useFestivalActivityStore();

const activity = computed<FestivalTask["festivalActivity"]>(
  () => ftStore.selectedTask.festivalActivity,
);

const emit = defineEmits(["open:calendar"]);
const openCalendar = () => emit("open:calendar");

const linkDrive = (link: AssignDrive) => {
  faStore.linkDrive(link, activity.value.id);
};
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

.time-windows-title {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 1rem;
  margin: 25px 0 5px 0;
}
</style>

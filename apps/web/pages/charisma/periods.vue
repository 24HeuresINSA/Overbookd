<template>
  <DesktopPageTitle title="Assignation du charisme aux disponibilités" />
  <div class="charisma-periods">
    <v-card>
      <v-card-text>
        <CharismaPeriodTable
          :loading="loading"
          @update="openEditDialog"
          @delete="deleteCharismaPeriod"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text="Ajouter un créneau"
          color="primary"
          @click="openAddDialog"
        />
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-text>
        <OverCalendar
          v-model="calendarDisplayedDay"
          :events="calendarEvents"
          clickable-events
          @event-click="openEditDialog"
        />
      </v-card-text>
    </v-card>
  </div>

  <v-dialog v-model="isAddDialogOpen" max-width="600px">
    <CharismaPeriodForm @create="addCharismaPeriod" @close="closeAddDialog" />
  </v-dialog>

  <v-dialog v-model="isUpdateDialogOpen" max-width="600px">
    <CharismaPeriodForm
      :charisma-period="selectedCharismaPeriod"
      @update="updateCharismaPeriod"
      @close="closeEditDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { CharismaPeriod, SavedCharismaPeriod } from "@overbookd/http";
import {
  type CalendarEvent,
  CreateCalendarEvent,
} from "~/utils/calendar/event";
import { getCharismaColor } from "~/utils/charisma/charisma-period.utils";

useHead({ title: "Charisme des dispos" });

const charismaPeriodStore = useCharismaPeriodStore();
const configurationStore = useConfigurationStore();

const charismaPeriods = computed<SavedCharismaPeriod[]>(
  () => charismaPeriodStore.all,
);
const loading = ref<boolean>(charismaPeriods.value.length === 0);
charismaPeriodStore.fetchCharismaPeriods().then(() => (loading.value = false));

const selectedCharismaPeriod = ref<SavedCharismaPeriod | undefined>();
const isAddDialogOpen = ref<boolean>(false);
const isUpdateDialogOpen = ref<boolean>(false);

const openAddDialog = () => (isAddDialogOpen.value = true);
const closeAddDialog = () => (isAddDialogOpen.value = false);

const openEditDialog = (charismaPeriod: SavedCharismaPeriod) => {
  selectedCharismaPeriod.value = charismaPeriod;
  isUpdateDialogOpen.value = true;
};
const closeEditDialog = () => {
  selectedCharismaPeriod.value = undefined;
  isUpdateDialogOpen.value = false;
};

const addCharismaPeriod = async (charismaPeriod: CharismaPeriod) => {
  await charismaPeriodStore.addCharismaPeriod(charismaPeriod);
  closeAddDialog();
};
const updateCharismaPeriod = async (charismaPeriod: SavedCharismaPeriod) => {
  await charismaPeriodStore.updateCharismaPeriod(charismaPeriod);
  closeEditDialog();
};
const deleteCharismaPeriod = async (charismaPeriod: SavedCharismaPeriod) => {
  await charismaPeriodStore.deleteCharismaPeriod(charismaPeriod);
};

const calendarDisplayedDay = ref<Date>(configurationStore.eventStartDate);
const maxCharisma = computed<number>(() =>
  Math.max(...charismaPeriods.value.map(({ charisma }) => charisma)),
);
const calendarEvents = computed<CalendarEvent[]>(() =>
  charismaPeriods.value.map((cp) =>
    CreateCalendarEvent.init({
      ...cp,
      start: cp.start,
      end: cp.end,
      name: cp.charisma.toString(),
      color: getCharismaColor(cp.charisma, maxCharisma.value),
    }),
  ),
);
</script>

<style lang="scss" scoped>
.charisma-periods {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>

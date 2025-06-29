<template>
  <DialogCard without-actions @close="close">
    <template #title>
      [{{ selectedTask.id }}] {{ selectedTask.name }}
      <v-icon
        v-if="canReadFT"
        icon="mdi-open-in-new"
        aria-label="Ouvrir dans un nouvel onglet"
        title="Ouvrir dans un nouvel onglet"
        size="x-small"
        @click="openAssignmentInNewTab"
      />
    </template>
    <template #content>
      <div class="assignment-details__content">
        <div class="assignment-metadata">
          <v-chip
            color="primary"
            variant="elevated"
            class="assignment-metadata__chip"
            @click="openLocation"
          >
            <v-icon icon="mdi-map-marker" />
            <span>
              {{
                selectedTask.appointment
                  ? selectedTask.appointment.name
                  : "Aucun lieu assigné"
              }}
            </span>
          </v-chip>
          <v-chip
            color="primary"
            variant="elevated"
            class="assignment-metadata__chip"
          >
            <v-icon icon="mdi-clock" />
            <span>
              {{ formatTimeWindowForCalendar(selectedTask.timeWindow) }}
            </span>
          </v-chip>
        </div>
      </div>
      <div class="contacts">
        <h3>
          Orga{{ selectedTask.contacts.length > 1 ? "s" : "" }} à contacter
        </h3>
        <ul>
          <li v-for="contact in selectedTask.contacts" :key="contact.id">
            {{ buildUserNameWithNickname(contact) }} -
            {{ formatUserPhone(contact.phone) }}
          </li>
        </ul>
      </div>
      <div class="contacts">
        <h3>Bénévoles affectés sur le créneau</h3>
        <ul>
          <li v-for="user in selectedTask.assignees" :key="user.id">
            {{ buildUserNameWithNickname(user) }}
          </li>
        </ul>
      </div>
      <div class="instructions">
        <h3>Instructions</h3>
        <div
          v-html-safe="selectedTask.globalInstruction"
          class="instructions__text"
        />
      </div>
      <div v-if="selectedTask.inChargeInstruction" class="instructions">
        <h3>Instructions pour les responsables</h3>
        <div
          v-html-safe="selectedTask.inChargeInstruction"
          class="instructions__text"
        />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { TimeWindow } from "@overbookd/festival-event";
import {
  LocationFactory,
  type Coordinate,
  type GeoLocation,
} from "@overbookd/geo-location";
import type { TaskForCalendar } from "@overbookd/http";
import { READ_FT } from "@overbookd/permission";
import { formatDateToHumanReadable } from "@overbookd/time";
import { buildUserNameWithNickname } from "@overbookd/user";
import { FT_URL } from "@overbookd/web-page";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";
import { formatUserPhone } from "~/utils/user/user.utils";

const userStore = useUserStore();
const locationStore = useLocationStore();

const props = defineProps({
  selectedTask: {
    type: Object as PropType<TaskForCalendar>,
    required: true,
  },
});

const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

const openAssignmentInNewTab = () => {
  openPageWithIdInNewTab(FT_URL, props.selectedTask.id);
};

const formatTimeWindowForCalendar = ({ start, end }: TimeWindow) =>
  `${formatDateToHumanReadable(start)} - ${formatDateToHumanReadable(end)}`;

const retrieveGeo = (geoLocation: GeoLocation): Coordinate => {
  const location = LocationFactory.create(geoLocation);
  return location.barycentre.coordinates;
};

const openLocation = () => {
  const appointment = props.selectedTask.appointment;
  if (!appointment) return;
  const location = locationStore.getLocationById(appointment.id);
  if (!location?.geoLocation) return;
  const { lat, lng } = retrieveGeo(location.geoLocation);
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
};

const emit = defineEmits(["close"]);
const close = () => emit("close");

if (locationStore.all.length === 0) locationStore.fetchAllLocations();
</script>

<style lang="scss" scoped>
.assignment-metadata {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;

  &__chip {
    .v-icon {
      margin-right: 5px;
    }
  }
}

.assignment-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
    .friend-list {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 4px 0;
    }
  }
}

.assignees {
  &__assignee-team {
    margin-left: 4px;
  }
  &__actions {
    display: flex;
    gap: 5px;
  }
}

.volunteer-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.instructions {
  padding-top: 2rem;

  &__text {
    margin-left: 1rem;
  }
  :deep(h1) {
    font-size: x-large;
  }
  :deep(h2) {
    font-size: large;
  }
  :deep(ul),
  :deep(ol) {
    padding-left: 2rem;
  }
}

.contacts {
  padding-top: 2rem;

  > ul {
    padding-left: 2rem;
  }
}
</style>

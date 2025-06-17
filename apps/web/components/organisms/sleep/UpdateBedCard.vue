<template>
  <v-card title="Modifier un lit">
    <v-card-text>
      <v-form @submit.prevent="updateBed">
        <v-text-field v-model="bedName" :rules="[required]" label="Lit" />
        <v-combobox
          v-model="roomName"
          :rules="[required]"
          label="Salle dodo"
          :items="rooms"
          auto-select-first
        />
        <v-row v-if="isOccupied(bed)" dense>
          <v-col>
            <DateTimeField
              v-if="datetime"
              v-model="datetime"
              label="Réveil"
              :step="5"
              :rules="[required]"
            />
          </v-col>
        </v-row>
        <v-textarea
          v-if="isOccupied(bed)"
          v-model="comment"
          label="Commentaire"
        />
        <v-btn
          color="primary"
          size="large"
          text="Enregistrer"
          append-icon="mdi-check"
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {
  type Bed,
  type AboutBed,
  type Sleeper,
  isOccupied,
} from "@overbookd/sleep";
import type { SubmitEventPromise } from "vuetify";
import { VForm } from "vuetify/components";
import { required } from "~/utils/rules/input.rules";

const sleepStore = useSleepStore();
const rooms = computed<string[]>(() =>
  sleepStore.allRooms.map(({ label }) => label),
);

const { bed } = defineProps({
  bed: {
    type: Object as PropType<Bed>,
    required: true,
  },
});

const bedName = ref<string>(bed.bed.label);
const roomName = ref<string>(bed.bed.room.label);
const datetime = ref<Date | undefined>(
  isOccupied(bed) ? bed.sleeper?.wakeupTime : undefined,
);
const comment = ref<string | undefined>(
  isOccupied(bed) ? bed.sleeper?.comment : undefined,
);
const loading = ref<boolean>(false);

const updateBed = async (form: SubmitEventPromise) => {
  const { valid } = await form;
  if (!valid) return;
  loading.value = true;

  const updateBed: AboutBed = {
    room: {
      label: roomName.value,
    },
    label: bedName.value,
  };
  const updatedSleeper: Sleeper | undefined =
    isOccupied(bed) && datetime.value
      ? {
          name: bed.sleeper.name,
          wakeupTime: datetime.value,
          comment: comment.value,
          id: bed.sleeper.id,
        }
      : undefined;
  await sleepStore.editBed(bed.id, updateBed, updatedSleeper);
  sleepStore.clearSelectedBed();
  loading.value = false;
};
</script>

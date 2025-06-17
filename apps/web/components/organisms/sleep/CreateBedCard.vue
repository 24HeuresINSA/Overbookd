<template>
  <v-card title="Ajouter un lit">
    <v-card-text>
      <v-form ref="refForm" @submit.prevent="createBed">
        <v-row dense>
          <v-col cols="8">
            <v-text-field v-model="bedName" :rules="[required]" label="Lit" />
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="minIndex"
              label="De"
              type="number"
              min="1"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="maxIndex"
              label="À"
              type="number"
              min="1"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-combobox
              v-model="roomName"
              :rules="[required]"
              label="Salle dodo"
              :items="rooms"
              auto-select-first
            />
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          size="large"
          text="Enregistrer"
          append-icon="mdi-plus"
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
import type { AboutBed } from "@overbookd/sleep";
import type { SubmitEventPromise } from "vuetify";
import { VForm } from "vuetify/components";
import { required } from "~/utils/rules/input.rules";

const sleepStore = useSleepStore();
const rooms = computed<string[]>(() =>
  sleepStore.allRooms.map(({ label }) => label),
);
const beds = computed<AboutBed[]>(() =>
  sleepStore.allBeds.map(({ bed }) => bed),
);

const refForm = ref<VForm | null>(null);

const bedName = ref<string>("");
const roomName = ref<string>("");
const minIndex = ref<number | undefined>();
const maxIndex = ref<number | undefined>();
const loading = ref<boolean>(false);

const createBatchBeds = async () => {
  if (maxIndex.value === undefined || minIndex.value === undefined) return;
  const createdBeds: AboutBed[] = Array.from(
    { length: maxIndex.value - minIndex.value + 1 },
    (_, i) => i + (minIndex.value ?? 0),
  )
    .map((idx) => `${bedName.value} ${idx}`)
    .filter(
      (bedLabel) =>
        !beds.value
          .filter(({ room }) => room.label === roomName.value)
          .map(({ label }) => label)
          .includes(bedLabel),
    )
    .map((label) => ({
      label,
      room: {
        label: roomName.value,
      },
    }));
  await sleepStore.createBedBatch(createdBeds);
};

const createSingleBed = async () => {
  const newBed: AboutBed = {
    room: {
      label: roomName.value,
    },
    label: bedName.value,
  };
  await sleepStore.createBed(newBed);
};

const createBed = async (form: SubmitEventPromise) => {
  const { valid } = await form;
  if (!valid) return;
  loading.value = true;

  if (minIndex.value === undefined || maxIndex.value === undefined) {
    await createSingleBed();
  } else {
    await createBatchBeds();
  }

  refForm.value?.reset();
  loading.value = false;
};
</script>

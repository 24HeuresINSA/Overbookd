<template>
  <v-card title="Envoyer un orga dormir">
    <v-card-text>
      <v-form ref="refForm" @submit.prevent="assignBed">
        <v-container>
          <v-row dense>
            <v-col>
              <DateTimeField
                v-model="datetime"
                label="Réveil"
                :step="5"
                :rules="[required, isFuture]"
              />
            </v-col>
            <v-col>
              <v-combobox
                v-model="volunteer"
                label="Orga"
                :items="adherents.map(({ fullname }) => fullname)"
                item-title="fullname"
                auto-select-first
                :rules="[required]"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-autocomplete
                v-model="selectedRoom"
                label="Salle dodo"
                :items="rooms"
                item-title="label"
                return-object
                clearable
                :rules="[required]"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectedBed"
                label="Lit"
                item-title="bed.label"
                :items="selectableBeds"
                return-object
                clearable
                :rules="[required]"
              />
            </v-col>
          </v-row>
          <v-textarea v-model="comment" label="Commentaire" />
          <v-btn
            color="primary"
            size="large"
            text="Au dodo !"
            append-icon="mdi-sleep"
            type="submit"
            block
            :loading="loading"
            :disabled="loading"
          />
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  type Room,
  type EmptyBed,
  type Bed,
  isEmpty,
  type Sleeper,
} from "@overbookd/sleep";
import { roundMinutes } from "@overbookd/time";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { SubmitEventPromise } from "vuetify";
import type { VForm } from "vuetify/components";
import { required } from "~/utils/rules/input.rules";

const sleepStore = useSleepStore();
const userStore = useUserStore();
const rooms = computed<Room[]>(() => sleepStore.allRooms);
const beds = computed<Bed[]>(() => sleepStore.allBeds);
const sleeperNames = computed<string[]>(() =>
  sleepStore.occupiedBeds.map(({ sleeper }) => sleeper.name),
);
const adherents = computed(() =>
  userStore.adherents
    .map((adherent) => ({
      ...adherent,
      fullname: buildUserNameWithNickname({
        firstname: adherent.firstname,
        lastname: adherent.lastname,
        nickname: adherent.nickname,
      }),
    }))
    .filter(({ fullname }) => !sleeperNames.value.includes(fullname)),
);

const now = new Date();
now.setHours(now.getHours() + 4);
const datetime = ref<Date>(roundMinutes(now, 5) ?? new Date());
const volunteer = ref<string>();
const selectedRoom = ref<Room>();
const selectedBed = ref<EmptyBed>();
const comment = ref<string>();
const loading = ref(false);
const refForm = ref<VForm | null>(null);

const selectableBeds = computed(() => {
  return (
    selectedRoom.value
      ? beds.value.filter(
          ({ bed }) => bed.room.label === selectedRoom.value?.label,
        )
      : beds.value
  )
    .filter((bed) => isEmpty(bed))
    .map((bed) => ({
      ...bed,
      bed: {
        ...bed.bed,
        label: `${bed.bed.label} (${bed.bed.room.label})`,
      },
    }));
});

watch(selectedBed, (next) => {
  selectedRoom.value =
    rooms.value.find(({ label }) => label === next?.bed.room.label) ??
    selectedRoom.value;
});

const isFuture = (value: string): true | string => {
  return new Date(value) < new Date() ? "Date dans le passé" : true;
};

const assignBed = async (form: SubmitEventPromise) => {
  const { valid } = await form;
  if (!valid) return;
  if (selectedBed.value === undefined) return;
  if (volunteer.value === undefined) return;

  loading.value = true;

  const overbookdUser = adherents.value.find(
    ({ fullname }) => fullname === volunteer.value,
  );

  const sleeper: Sleeper = {
    id: overbookdUser?.id,
    name: overbookdUser?.fullname ?? volunteer.value,
    wakeupTime: datetime.value,
  };
  if (comment.value) {
    sleeper["comment"] = comment.value;
  }
  await sleepStore.assignBed(selectedBed.value.id, sleeper);
  volunteer.value = undefined;
  selectedRoom.value = undefined;
  selectedBed.value = undefined;
  comment.value = undefined;
  const nd = new Date();
  nd.setHours(nd.getHours() + 4);
  datetime.value = roundMinutes(nd, 5) ?? new Date();
  loading.value = false;
};
</script>

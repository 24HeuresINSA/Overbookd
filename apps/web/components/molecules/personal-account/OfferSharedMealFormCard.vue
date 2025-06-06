<template>
  <v-card class="offer-shared-meal">
    <v-btn
      v-if="closable"
      icon="mdi-close"
      class="close-btn"
      variant="flat"
      @click="close"
    />
    <v-card-title>Proposer un repas</v-card-title>
    <v-card-text>
      <div class="when">
        <DateField v-model="day" hide-details class="day" />
        <v-select
          v-model="moment"
          :items="moments"
          class="moment"
          hide-details
        />
      </div>
      <div class="menu">
        <h3><v-icon>mdi-silverware</v-icon> Au menu</h3>
        <v-textarea v-model="menu" variant="outlined" label="Menu" />
      </div>
      <v-btn
        class="offer"
        color="primary"
        size="large"
        text="C'est prêt !"
        append-icon="mdi-silverware-fork-knife"
        @click="offer"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import {
  MIDI,
  SOIR,
  type Moment,
  type MealDate,
} from "@overbookd/personal-account";

const mealSharingStore = useMealSharingStore();

const { closable } = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const day = ref<Date>(new Date());
const moment = ref<Moment>(MIDI);
const menu = ref<string>("");

const moments: Moment[] = [MIDI, SOIR];
const date = computed<MealDate>(() => ({
  moment: moment.value,
  day: OverDate.from(day.value).dateString,
}));

const offer = async () => {
  await mealSharingStore.offerSharedMeal({
    menu: menu.value,
    date: date.value,
  });
  menu.value = "";
  day.value = new Date();
  moment.value = MIDI;
  if (closable) close();
};
</script>

<style lang="scss" scoped>
.offer-shared-meal {
  min-width: 33%;
}

h2 {
  text-wrap: nowrap;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.when {
  display: flex;
  align-items: flex-end;
  font-size: large;
  gap: 5px;
  margin-bottom: 15px;

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-self: flex-start;
    gap: 10px;
    .day,
    .moment {
      min-width: 100%;
    }
  }
}

.offer {
  width: 100%;
}
</style>

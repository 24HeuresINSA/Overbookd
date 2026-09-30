<template>
  <v-card class="offer-shared-meal">
    <v-card-item>
      <v-card-title class="offer-shared-meal__title">
        <v-icon icon="mdi-chef-hat" />
        Proposer un repas
      </v-card-title>
      <template v-if="closable" #append>
        <v-btn
          icon="mdi-close"
          aria-label="Fermer"
          title="Fermer"
          variant="text"
          @click="close"
        />
      </template>
    </v-card-item>

    <v-card-text class="offer-shared-meal__content">
      <div class="when">
        <DateField v-model="day" label="Jour" hide-details />
        <v-btn-toggle
          v-model="moment"
          mandatory
          color="primary"
          variant="tonal"
          size="large"
          class="moment"
        >
          <v-btn :value="MIDI" prepend-icon="mdi-weather-sunny"> Midi </v-btn>
          <v-btn :value="SOIR" prepend-icon="mdi-weather-night"> Soir </v-btn>
        </v-btn-toggle>
      </div>

      <v-textarea
        v-model="menu"
        label="Au menu"
        placeholder="Lasagnes maison, salade, tiramisu..."
        prepend-inner-icon="mdi-silverware"
        rows="3"
        auto-grow
        hide-details
      />

      <v-switch
        v-model="areMultipleShotgunsAllowed"
        label="Autoriser les shotguns multiples"
        color="primary"
        density="compact"
        hide-details
      />

      <v-btn
        color="primary"
        variant="flat"
        size="large"
        text="C'est prêt !"
        append-icon="mdi-silverware-fork-knife"
        :disabled="!menu.trim()"
        block
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
const areMultipleShotgunsAllowed = ref<boolean>(false);

const date = computed<MealDate>(() => ({
  moment: moment.value,
  day: OverDate.from(day.value).dateString,
}));

const offer = async () => {
  await mealSharingStore.offerSharedMeal({
    menu: menu.value,
    date: date.value,
    areMultipleShotgunsAllowed: areMultipleShotgunsAllowed.value,
  });
  menu.value = "";
  day.value = new Date();
  moment.value = MIDI;
  areMultipleShotgunsAllowed.value = false;
  if (closable) close();
};
</script>

<style lang="scss" scoped>
.offer-shared-meal {
  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}

.when {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .moment {
    width: 100%;
    gap: 10px;
    background: transparent;

    .v-btn {
      flex: 1 1 0;
      height: 56px;
      border-radius: $field-border-radius !important;
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      font-weight: 500;
      text-transform: none;
    }

    .v-btn--active {
      border-color: rgb(var(--v-theme-primary));
    }
  }
}
</style>

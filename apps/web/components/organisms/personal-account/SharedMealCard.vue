<template>
  <div class="shared-meal">
    <v-card class="shared-meal">
      <v-card-title class="meal-title">{{ shared.meal.date }}</v-card-title>
      <v-card-text class="presentation">
        <div class="chief">
          <v-icon>mdi-chef-hat</v-icon>
          <span>{{ shared.chef.name }}</span>
        </div>

        <div class="menu">
          <v-textarea
            :model-value="shared.meal.menu"
            variant="outlined"
            label="Au menu 🍴"
            readonly
            hide-details
            :rows="4"
          />
        </div>

        <div class="shotgun">
          <span>
            {{ shared.shotgunCount }} {{ guests }}
            <span v-show="hasShotgun"> (dont moi)</span>
          </span>
          <v-btn
            color="primary"
            size="large"
            text="Shotgun"
            append-icon="mdi-account-multiple-plus"
            :disabled="hasShotgun"
            @click="shotgun"
          />
          <v-btn
            v-if="iAmChef"
            color="secondary"
            size="large"
            text="Renseigner une dépense"
            append-icon="mdi-cash-multiple"
            @click="openRecordExpenseDialog"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isRecordExpenseDialogOpen" max-width="600px">
      <RecordSharedMealExpenseDialogCard
        :shared="shared"
        @close="closeRecordExpenseDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  OnGoingSharedMealBuilder,
  type Adherent,
  type SharedMeal,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";

const userStore = useUserStore();
const mealSharingStore = useMealSharingStore();

const props = defineProps({
  shared: {
    type: Object as PropType<SharedMeal>,
    required: true,
  },
});

const me = computed<Adherent>(() => {
  const { id, ...me } = userStore.me;
  return { id, name: nicknameOrName(me) };
});
const iAmChef = computed<boolean>(() => props.shared.chef.id === me.value.id);
const guests = computed<string>(() =>
  props.shared.shotgunCount > 1 ? "convives" : "convive",
);
const builder = computed<OnGoingSharedMealBuilder>(() =>
  OnGoingSharedMealBuilder.build(props.shared),
);
const hasShotgun = computed<boolean>(() =>
  builder.value.hasShotgun(me.value.id),
);

const isRecordExpenseDialogOpen = ref<boolean>(false);
const openRecordExpenseDialog = () => {
  isRecordExpenseDialogOpen.value = true;
};
const closeRecordExpenseDialog = () => {
  isRecordExpenseDialogOpen.value = false;
};

const shotgun = () => {
  mealSharingStore.shotgun(props.shared.id);
};
</script>

<style lang="scss" scoped>
.meal-title {
  text-transform: capitalize;
}
.presentation {
  display: flex;
  gap: 15px;
  align-items: center;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    .chief,
    .menu,
    .shotgun {
      min-width: 100%;
    }
  }
  .chief {
    flex-grow: 1;
    display: flex;
    align-items: baseline;
    gap: 3px;
    font-size: 1.2rem;
    i {
      font-size: 2rem;
    }
  }
  .menu {
    flex-grow: 3;
  }
  .shotgun {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>

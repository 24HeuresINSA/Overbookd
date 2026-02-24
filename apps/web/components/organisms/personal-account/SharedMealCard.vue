<template>
  <div class="shared-meal">
    <v-card class="shared-meal">
      <v-card-title class="meal-title">
        <span class="meal-title__date">
          {{ shared.meal.date }}
        </span>
        <div class="meal-title__chef">
          <v-icon>mdi-chef-hat</v-icon>
          <span>{{ shared.chef.name }}</span>
        </div>
      </v-card-title>
      <v-card-text class="presentation">
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

        <div class="shotguns">
          <details>
            <summary>
              {{ shared.shotgunCount }} {{ guests }}
              <span v-show="hasShotgun"> (dont moi)</span>
            </summary>
            <ul>
              <li v-for="guest in shared.shotguns" :key="guest.id">
                {{ guest.name }}
                <v-btn
                  v-if="iAmChef"
                  icon="mdi-exit-run"
                  aria-label="Annuler le shotgun"
                  title="Annuler le shotgun"
                  size="x-small"
                  variant="flat"
                  color="tertiary"
                  @click="cancelShotgun(guest)"
                />
              </li>
            </ul>
          </details>
          <v-btn
            v-if="iAmChef"
            color="tertiary"
            size="large"
            text="Annuler le repas"
            append-icon="mdi-cancel"
            @click="openCancelConfirmationDialog"
          />
          <v-btn
            color="primary"
            size="large"
            :text="areShotgunsOpen ? 'Shotgun' : 'Les shotguns sont fermés'"
            append-icon="mdi-account-multiple-plus"
            :disabled="hasShotgun || areShotgunsClose"
            @click="shotgun"
          />
          <v-btn
            v-if="iAmChef"
            color="tertiary"
            size="large"
            :text="
              areShotgunsOpen ? 'Fermer les shotguns' : 'Ouvrir les shotguns'
            "
            :append-icon="areShotgunsOpen ? 'mdi-door-closed' : 'mdi-door-open'"
            @click="toggleShotguns"
          />
          <v-btn
            v-if="iAmChef"
            color="secondary"
            size="large"
            text="Clore le repas"
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

    <v-dialog v-model="isCancelConfirmationDialogOpen" width="600px">
      <ConfirmationDialogCard
        confirm-color="error"
        @close="closeCancelConfirmationDialog"
        @confirm="cancelMeal"
      >
        <template #title> Annuler le repas partagé </template>
        <template #statement>
          Tu es sur le point d'annuler le repas du
          <strong>{{ shared.meal.date }}</strong>
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  OnGoingSharedMealBuilder,
  type Adherent,
  type SharedMeal,
  type Shotgun,
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
  const loggedUser = userStore.loggedUser;
  if (!loggedUser) return { id: 0, name: "" };
  const { id, ...me } = loggedUser;
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
const areShotgunsOpen = computed<boolean>(() => builder.value.areShotgunsOpen);
const areShotgunsClose = computed<boolean>(() => !areShotgunsOpen.value);

const isRecordExpenseDialogOpen = ref<boolean>(false);
const openRecordExpenseDialog = () => (isRecordExpenseDialogOpen.value = true);
const closeRecordExpenseDialog = () =>
  (isRecordExpenseDialogOpen.value = false);

const isCancelConfirmationDialogOpen = ref<boolean>(false);
const openCancelConfirmationDialog = () =>
  (isCancelConfirmationDialogOpen.value = true);
const closeCancelConfirmationDialog = () =>
  (isCancelConfirmationDialogOpen.value = false);

const shotgun = () => {
  mealSharingStore.shotgun(props.shared.id);
};

const cancelShotgun = (guest: Shotgun) => {
  mealSharingStore.cancelShotgun(props.shared.id, guest.id);
};

const cancelMeal = () => {
  mealSharingStore.cancelMeal(props.shared.id);
  closeCancelConfirmationDialog();
};

const toggleShotguns = () => {
  areShotgunsOpen.value
    ? mealSharingStore.closeShotguns(props.shared.id)
    : mealSharingStore.openShotguns(props.shared.id);
};
</script>

<style lang="scss" scoped>
.meal-title {
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
  &__chef {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: smaller;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: start;
    padding-right: unset;
    &__chef {
      flex-direction: row;
      align-items: baseline;
      gap: 3px;
    }
  }
}
.presentation {
  display: flex;
  gap: 15px;
  align-items: center;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    .menu,
    .shotguns {
      min-width: 100%;
    }
  }
  .chef {
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
    flex-grow: 1;
  }
  .shotguns {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

details {
  li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 5px;
  }
}
</style>

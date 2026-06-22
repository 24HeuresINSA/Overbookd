<template>
  <div>
    <v-card>
      <v-card-title class="meal-title">
        <span class="meal-title__date">
          {{ shared.meal.date }}
        </span>

        <div class="meal-title__chef">
          <v-icon>mdi-chef-hat</v-icon>
          <span>{{ shared.chef.name }}</span>
        </div>
      </v-card-title>

      <v-card-text class="column">
        <div class="presentation">
          <div class="column">
            <v-textarea
              :model-value="shared.meal.menu"
              variant="outlined"
              label="Au menu 🍴"
              readonly
              hide-details
              :rows="4"
            />
          </div>

          <div class="column">
            <details>
              <summary>
                {{ shared.portionCount }}
                {{ pluralize("portion", shared.portionCount) }}
                <span v-show="myPortionCount > 0">
                  (dont {{ myPortionCount }}
                  {{ pluralize("portion", myPortionCount) }} pour moi)
                </span>
              </summary>

              <ul>
                <li v-for="guest in shared.shotguns" :key="guest.id">
                  {{ guest.name }}
                  ({{ guest.portions }}
                  {{ pluralize("portion", guest.portions) }})

                  <div class="actions">
                    <v-btn
                      v-if="iAmChef && guest.portions > 1"
                      icon="mdi-numeric-negative-1"
                      aria-label="Retirer une portion"
                      title="Retirer une portion"
                      size="small"
                      density="comfortable"
                      variant="flat"
                      color="secondary"
                      @click="removePortion(guest)"
                    />

                    <v-btn
                      v-if="iAmChef"
                      icon="mdi-exit-run"
                      aria-label="Annuler le shotgun"
                      title="Annuler le shotgun"
                      size="small"
                      density="comfortable"
                      variant="flat"
                      color="tertiary"
                      @click="cancelShotgun(guest)"
                    />
                  </div>
                </li>
              </ul>
            </details>

            <div
              :title="
                getShotgunTitle(areMultipleShotgunsAllowed, myPortionCount)
              "
            >
              <v-btn
                color="primary"
                size="large"
                :text="
                  areShotgunsOpen
                    ? areMultipleShotgunsAllowed && myPortionCount > 0
                      ? 'Ajouter une portion'
                      : 'Shotgun'
                    : 'Les shotguns sont fermés'
                "
                append-icon="mdi-account-multiple-plus"
                :disabled="!canIShotgun"
                block
                @click="shotgun"
              />
            </div>
          </div>
        </div>

        <div v-if="iAmChef" class="presentation">
          <div class="column">
            <v-btn
              color="secondary"
              text="Clore le repas"
              append-icon="mdi-cash-multiple"
              @click="openRecordExpenseDialog"
            />

            <v-btn
              color="tertiary"
              text="Annuler le repas"
              append-icon="mdi-cancel"
              @click="openCancelConfirmationDialog"
            />
          </div>

          <div class="column">
            <v-btn
              :color="areShotgunsOpen ? 'tertiary' : 'secondary'"
              :text="
                areShotgunsOpen ? 'Fermer les shotguns' : 'Ouvrir les shotguns'
              "
              :append-icon="
                areShotgunsOpen ? 'mdi-door-closed' : 'mdi-door-open'
              "
              @click="toggleShotguns"
            />

            <v-btn
              :color="areMultipleShotgunsAllowed ? 'tertiary' : 'secondary'"
              :text="
                areMultipleShotgunsAllowed
                  ? 'Retirer les shotguns multiples'
                  : 'Autoriser les shotguns multiples'
              "
              :append-icon="
                areMultipleShotgunsAllowed
                  ? 'mdi-account-multiple-remove-outline'
                  : 'mdi-account-multiple-plus-outline'
              "
              @click="toggleMultipleShotguns"
            />
          </div>
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
          <strong> {{ shared.meal.date }} </strong>.
        </template>
      </ConfirmationDialogCard>
    </v-dialog>

    <v-dialog
      v-model="isDisallowMultipleShotgunsConfirmationDialogOpen"
      width="700px"
    >
      <ConfirmationDialogCard
        confirm-color="tertiary"
        @close="closeDisallowMultipleShotgunsConfirmationDialog"
        @confirm="disallowMultipleShotguns"
      >
        <template #title> Désactiver les shotguns multiples </template>
        <template #statement>
          Tu es sur le point de désactiver les shotguns multiples pour le repas
          du <strong> {{ shared.meal.date }} </strong>.
          <br />
          Cela va fixer le nombre de portion à 1 pour chaque invité.
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  MAX_PORTIONS_PER_GUEST,
  OnGoingSharedMealBuilder,
  type Adherent,
  type SharedMeal,
  type Shotgun,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";
import { getShotgunTitle } from "~/utils/easter-egg/shotgun";

const userStore = useUserStore();
const mealSharingStore = useMealSharingStore();

const { shared } = defineProps({
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
const iAmChef = computed<boolean>(() => shared.chef.id === me.value.id);

const builder = computed<OnGoingSharedMealBuilder>(() =>
  OnGoingSharedMealBuilder.build(shared),
);
const myPortionCount = computed<number>(
  () => builder.value.getShotgunCount(me.value.id)
);
const areShotgunsOpen = computed<boolean>(() => builder.value.areShotgunsOpen);
const areMultipleShotgunsAllowed = computed<boolean>(
  () => builder.value.areMultipleShotgunsAllowed,
);
const canIShotgun = computed<boolean>(
  () => builder.value.canShotgun(me.value.id)
);

const isRecordExpenseDialogOpen = ref<boolean>(false);
const openRecordExpenseDialog = () => (isRecordExpenseDialogOpen.value = true);
const closeRecordExpenseDialog = () =>
  (isRecordExpenseDialogOpen.value = false);

const isCancelConfirmationDialogOpen = ref<boolean>(false);
const openCancelConfirmationDialog = () =>
  (isCancelConfirmationDialogOpen.value = true);
const closeCancelConfirmationDialog = () =>
  (isCancelConfirmationDialogOpen.value = false);

const isDisallowMultipleShotgunsConfirmationDialogOpen = ref<boolean>(false);
const openDisallowMultipleShotgunsConfirmationDialog = () =>
  (isDisallowMultipleShotgunsConfirmationDialogOpen.value = true);
const closeDisallowMultipleShotgunsConfirmationDialog = () =>
  (isDisallowMultipleShotgunsConfirmationDialogOpen.value = false);

const shotgun = () => {
  mealSharingStore.shotgun(shared.id);
};

const removePortion = (guest: Shotgun) => {
  mealSharingStore.removePortion(shared.id, guest.id);
};

const cancelShotgun = (guest: Shotgun) => {
  mealSharingStore.cancelShotgun(shared.id, guest.id);
};

const cancelMeal = () => {
  mealSharingStore.cancelMeal(shared.id);
  closeCancelConfirmationDialog();
};

const toggleShotguns = () => {
  areShotgunsOpen.value
    ? mealSharingStore.closeShotguns(shared.id)
    : mealSharingStore.openShotguns(shared.id);
};

const toggleMultipleShotguns = () => {
  areMultipleShotgunsAllowed.value
    ? openDisallowMultipleShotgunsConfirmationDialog()
    : mealSharingStore.allowMultipleShotguns(shared.id);
};

const disallowMultipleShotguns = () => {
  mealSharingStore.disallowMultipleShotguns(shared.id);
  closeDisallowMultipleShotgunsConfirmationDialog();
};
</script>

<style lang="scss" scoped>
.meal-title {
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
  flex-wrap: wrap;
  padding-right: 40px;
  &__chef {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: smaller;
    @media screen and (max-width: $mobile-max-width) {
      flex-direction: row;
      gap: 3px;
      margin-bottom: 3px;
    }
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.presentation {
  display: flex;
  gap: 12px;
  align-items: start;
  flex-wrap: wrap;

  > * {
    flex: 1 1 0;
  }

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    > * {
      min-width: 100%;
    }
  }
}

details {
  summary {
    min-height: 28px;
    align-content: center;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    padding: 0 5px;

    .actions {
      display: flex;
      gap: 5px;
    }
  }
}
</style>

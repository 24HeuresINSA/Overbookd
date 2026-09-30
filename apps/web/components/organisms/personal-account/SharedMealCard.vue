<template>
  <v-card class="meal">
    <v-card-item class="meal__header">
      <template #prepend>
        <div class="chef-avatar" title="Chef·fe">
          <v-avatar
            color="secondary"
            size="52"
            :image="meal.chef.profilePicture"
            :text="getInitials(meal.chef.name)"
          />
          <v-icon icon="mdi-chef-hat" class="chef-avatar__hat" />
        </div>
      </template>
      <v-card-title class="meal__date">
        {{ meal.meal.date }}
      </v-card-title>
      <v-card-subtitle class="meal__chef">
        <span>Chef·fe : {{ iAmChef ? "toi" : meal.chef.name }}</span>
      </v-card-subtitle>

      <template #append>
        <v-menu v-if="iAmChef" location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="mdi-dots-vertical"
              variant="text"
              aria-label="Gérer le repas"
              title="Gérer le repas"
            />
          </template>
          <v-list class="meal-menu" density="comfortable">
            <v-list-subheader class="meal-menu__header">
              Gestion du repas
            </v-list-subheader>
            <v-list-item
              :prepend-icon="
                areShotgunsOpen ? 'mdi-door-closed' : 'mdi-door-open'
              "
              :title="
                areShotgunsOpen ? 'Fermer les shotguns' : 'Ouvrir les shotguns'
              "
              rounded="lg"
              @click="toggleShotguns"
            />
            <v-list-item
              :prepend-icon="
                areMultipleShotgunsAllowed
                  ? 'mdi-account-multiple-remove-outline'
                  : 'mdi-account-multiple-plus-outline'
              "
              :title="
                areMultipleShotgunsAllowed
                  ? 'Retirer les shotguns multiples'
                  : 'Autoriser les shotguns multiples'
              "
              rounded="lg"
              @click="toggleMultipleShotguns"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="mdi-cancel"
              title="Annuler le repas"
              base-color="error"
              rounded="lg"
              class="meal-menu__danger"
              @click="openCancelConfirmationDialog"
            />
          </v-list>
        </v-menu>
      </template>
    </v-card-item>

    <v-card-text class="meal__content">
      <div class="meal__menu">
        <h4 class="meal__section-title">
          <v-icon icon="mdi-silverware" size="small" /> Au menu
        </h4>
        <p>{{ meal.meal.menu }}</p>
      </div>

      <div class="meal__guests">
        <button
          type="button"
          class="meal__guests-toggle"
          :aria-expanded="areGuestsShown"
          @click="areGuestsShown = !areGuestsShown"
        >
          <span class="meal__section-title">
            <v-icon icon="mdi-account-group" size="small" />
            {{ meal.shotguns.length }}
            {{ pluralize("convive", meal.shotguns.length) }} ·
            {{ meal.portionCount }}
            {{ pluralize("portion", meal.portionCount) }}
          </span>
          <v-icon
            icon="mdi-chevron-down"
            class="meal__chevron"
            :class="{ 'meal__chevron--open': areGuestsShown }"
          />
        </button>

        <v-expand-transition>
          <div v-show="areGuestsShown">
            <v-list
              v-if="meal.shotguns.length > 0"
              density="compact"
              class="meal__guest-list"
            >
              <v-list-item
                v-for="guest in meal.shotguns"
                :key="guest.id"
                rounded="lg"
                class="meal__guest"
              >
                <template #prepend>
                  <v-avatar
                    color="secondary"
                    size="32"
                    :image="guest.profilePicture"
                    :text="getInitials(guest.name)"
                    class="meal__avatar"
                  />
                </template>
                <v-list-item-title>{{ guest.name }}</v-list-item-title>
                <template #append>
                  <span v-if="guest.portions > 1" class="meal__portions">
                    ×{{ guest.portions }}
                  </span>
                  <template v-if="iAmChef">
                    <v-btn
                      v-if="guest.portions > 1"
                      icon="mdi-minus"
                      size="small"
                      variant="text"
                      aria-label="Retirer une portion"
                      title="Retirer une portion"
                      @click="removePortion(guest)"
                    />
                    <v-btn
                      icon="mdi-close"
                      size="small"
                      variant="text"
                      class="meal__remove"
                      aria-label="Annuler le shotgun"
                      title="Annuler le shotgun"
                      @click="cancelShotgun(guest)"
                    />
                  </template>
                </template>
              </v-list-item>
            </v-list>
            <span v-else class="meal__empty">
              Personne pour l'instant, sois le·a premier·e !
            </span>
          </div>
        </v-expand-transition>
      </div>
    </v-card-text>

    <v-card-actions class="meal__actions">
      <div
        class="meal__action"
        :title="getShotgunTitle(areMultipleShotgunsAllowed, myPortionCount)"
      >
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          :text="shotgunText"
          prepend-icon="mdi-account-multiple-plus"
          :disabled="!canIShotgun"
          block
          @click="shotgun"
        />
      </div>
      <v-btn
        v-if="iAmChef"
        class="meal__action"
        color="secondary"
        variant="tonal"
        size="large"
        text="Clore le repas"
        prepend-icon="mdi-cash-multiple"
        @click="openRecordExpenseDialog"
      />
    </v-card-actions>

    <v-dialog v-model="isRecordExpenseDialogOpen" max-width="600px">
      <RecordSharedMealExpenseDialogCard
        :meal="meal"
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
          <strong> {{ meal.meal.date }} </strong>.
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
          du <strong> {{ meal.meal.date }} </strong>.
          <br />
          Cela va fixer le nombre de portion à 1 pour chaque invité.
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import {
  OnGoingSharedMealBuilder,
  type Adherent,
  type SharedMeal,
  type Shotgun,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";
import { getShotgunTitle } from "~/utils/easter-egg/shotgun";

const myStore = useMyStore();
const mealSharingStore = useMealSharingStore();

const { meal: meal } = defineProps({
  meal: {
    type: Object as PropType<SharedMeal>,
    required: true,
  },
});

const me = computed<Adherent>(() => {
  const loggedUser = myStore.loggedUser;
  if (!loggedUser) return { id: 0, name: "" };
  const { id, ...me } = loggedUser;
  return { id, name: nicknameOrName(me) };
});
const iAmChef = computed<boolean>(() => meal.chef.id === me.value.id);

const builder = computed<OnGoingSharedMealBuilder>(() =>
  OnGoingSharedMealBuilder.build(meal),
);
const myPortionCount = computed<number>(() =>
  builder.value.getShotgunCount(me.value.id),
);
const areShotgunsOpen = computed<boolean>(() => builder.value.areShotgunsOpen);
const areMultipleShotgunsAllowed = computed<boolean>(
  () => builder.value.areMultipleShotgunsAllowed,
);
const canIShotgun = computed<boolean>(() =>
  builder.value.canShotgun(me.value.id),
);

const shotgunText = computed<string>(() => {
  if (!areShotgunsOpen.value) return "Les shotguns sont fermés";
  if (myPortionCount.value === 0) return "Shotgun";
  return areMultipleShotgunsAllowed.value
    ? "Ajouter une portion"
    : "Déjà shotgun !";
});

const areGuestsShown = ref<boolean>(false);

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
  mealSharingStore.shotgun(meal.id);
};

const removePortion = (guest: Shotgun) => {
  mealSharingStore.removePortion(meal.id, guest.id);
};

const cancelShotgun = (guest: Shotgun) => {
  mealSharingStore.cancelShotgun(meal.id, guest.id);
};

const cancelMeal = () => {
  mealSharingStore.cancelMeal(meal.id);
  closeCancelConfirmationDialog();
};

const toggleShotguns = () => {
  areShotgunsOpen.value
    ? mealSharingStore.closeShotguns(meal.id)
    : mealSharingStore.openShotguns(meal.id);
};

const toggleMultipleShotguns = () => {
  areMultipleShotgunsAllowed.value
    ? openDisallowMultipleShotgunsConfirmationDialog()
    : mealSharingStore.allowMultipleShotguns(meal.id);
};

const disallowMultipleShotguns = () => {
  mealSharingStore.disallowMultipleShotguns(meal.id);
  closeDisallowMultipleShotgunsConfirmationDialog();
};
</script>

<style lang="scss" scoped>
.meal {
  display: flex;
  flex-direction: column;

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    white-space: normal;
    text-transform: capitalize;
  }

  &__chef {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.85;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex-grow: 1;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
  }

  &__menu .meal__section-title {
    margin-bottom: 6px;
  }

  &__menu p {
    white-space: pre-line;
    padding: 10px 14px;
    border-radius: $field-border-radius;
    background-color: rgba(var(--v-theme-on-surface), 0.05);
  }

  &__guests-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 4px 8px 4px 0;
    border-radius: $field-border-radius;
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(var(--v-theme-secondary), 0.1);
    }
  }

  &__chevron {
    transition: transform 0.2s;
    &--open {
      transform: rotate(180deg);
    }
  }

  &__guest-list {
    margin-top: 6px;
    padding: 0;
    max-height: 240px;
    overflow-y: auto;
    background: transparent;
  }

  &__guest {
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(var(--v-theme-secondary), 0.15);
    }
  }

  &__avatar {
    font-size: 0.75rem;
    font-weight: 500;
  }

  &__portions {
    font-weight: 600;
    margin-right: 4px;
  }

  &__remove:hover {
    color: rgb(var(--v-theme-error));
  }

  &__empty {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 16px 16px;

    .meal__action {
      flex: 1 1 200px;
      margin: 0;
    }
  }
}

.chef-avatar {
  position: relative;
  margin-top: 10px;

  &__hat {
    position: absolute;
    top: -17px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: $dark-24h;
    filter: drop-shadow(0 0 1px $white);
  }
}

.meal-menu {
  min-width: 260px;
  padding: 6px;
  border-radius: $main-page-border-radius !important;

  &__header {
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
  }

  .v-list-item {
    margin-bottom: 2px;
    &:hover {
      background-color: rgba(var(--v-theme-secondary), 0.15);
    }
  }

  &__danger:hover {
    background-color: rgba(var(--v-theme-error), 0.12) !important;
  }
}
</style>

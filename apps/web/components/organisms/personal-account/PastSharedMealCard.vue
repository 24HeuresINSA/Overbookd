<template>
  <div class="vertical-container">
    <v-card class="vertical-container">
      <v-btn
        class="close-btn"
        icon="mdi-close"
        variant="flat"
        aria-label="Fermer"
        title="Fermer"
        density="compact"
        @click="close"
      />

      <v-card-title class="meal-title">
        <span class="meal-title__date">
          {{ meal.meal.date }}
        </span>

        <div class="meal-title__chef" aria-label="Chef" title="Chef">
          <v-icon>mdi-chef-hat</v-icon>
          <span>{{ meal.chef.name }}</span>
        </div>
      </v-card-title>

      <v-card-text class="meal-content">
        <div class="presentation">
          <div class="column">
            <v-textarea
              :model-value="meal.meal.menu"
              variant="outlined"
              label="Au menu 🍴"
              readonly
              hide-details
              :rows="4"
            />

            <div class="ml-3">
              Coût total du repas : {{ Money.cents(meal.expense.amount) }}
            </div>
          </div>

          <div class="column">
            <details open>
              <summary>
                {{ meal.shotguns.length }}
                {{ pluralize("convive", meal.shotguns.length) }}
                -
                {{ meal.portionCount }}
                {{ pluralize("portion", meal.portionCount) }}
                <span v-show="myPortionCount > 0">
                  (dont {{ myPortionCount }}
                  {{ pluralize("portion", myPortionCount) }} pour moi)
                </span>
              </summary>

              <ul>
                <li v-for="guest in meal.shotguns" :key="guest.id">
                  {{ guest.name }}
                  ({{ guest.portions }}
                  {{ pluralize("portion", guest.portions) }})
                </li>
              </ul>
            </details>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import {
  OnGoingSharedMealBuilder,
  type Adherent,
  type PastSharedMeal,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";

const myStore = useMyStore();

const { meal } = defineProps({
  meal: {
    type: Object as PropType<PastSharedMeal>,
    required: true,
  },
});

const me = computed<Adherent>(() => {
  const loggedUser = myStore.loggedUser;
  if (!loggedUser) return { id: 0, name: "" };
  const { id, ...me } = loggedUser;
  return { id, name: nicknameOrName(me) };
});

const builder = computed<OnGoingSharedMealBuilder>(() =>
  OnGoingSharedMealBuilder.build(meal),
);
const myPortionCount = computed<number>(() =>
  builder.value.getShotgunCount(me.value.id),
);

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.vertical-container {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
}

.meal-title {
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
  flex-wrap: wrap;
  padding-right: 60px;

  &__chef {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: smaller;
    white-space: normal;

    @media screen and (max-width: $mobile-max-width) {
      flex-direction: row;
      gap: 5px;
      margin-bottom: 3px;
    }
  }
}

.meal-content {
  overflow-y: scroll;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.presentation {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 5px;

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
    pointer-events: none;
  }

  ul {
    max-height: 400px;
    overflow-y: scroll;

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
}
</style>

<template>
  <v-card>
    <v-btn
      v-if="closable"
      class="close-btn"
      density="comfortable"
      rounded="0"
      icon="mdi-close"
      variant="plain"
      @click="close"
    />
    <v-card-title id="expense-meal">
      <h2>Dépense du repas</h2>
      <h3>{{ shared.meal.date }}</h3>
    </v-card-title>
    <v-card-text>
      <v-textarea
        :model-value="shared.meal.menu"
        variant="outlined"
        label="Au menu 🍴"
        readonly
        hide-details
        :rows="4"
      />
      <form>
        <DateTimeField
          v-model="date"
          label="Quand la dépense a été réalisée"
          hide-details
        />
        <MoneyField
          v-model="amount"
          label="Somme totale du repas"
          hide-details
        />
        <v-btn
          color="primary"
          size="large"
          text="Renseigner"
          append-icon="mdi-cash-multiple"
          @click="recordExpense"
        />
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { OnGoingSharedMeal } from "@overbookd/personal-account";

const mealSharingStore = useMealSharingStore();

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
  shared: {
    type: Object as PropType<OnGoingSharedMeal>,
    required: true,
  },
});

const date = ref(new Date());
const amount = ref(0);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const recordExpense = () => {
  const mealId = props.shared.id;
  const expense = { amount: amount.value, date: date.value };
  mealSharingStore.recordExpense(mealId, expense);
  close();
};
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 0;
}
form {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
#expense-meal {
  display: block;
  h3 {
    margin-top: 20px;
  }
}
</style>

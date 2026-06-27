<template>
  <v-form v-model="isFormValid" @submit.prevent="recordExpense">
    <DialogCard @close="close">
      <template #title> Dépense du repas </template>
      <template #subtitle>
        <h3>{{ meal.meal.date }}</h3>
      </template>
      <template #content>
        <div class="content">
          <v-textarea
            :model-value="meal.meal.menu"
            variant="outlined"
            label="Au menu 🍴"
            readonly
            hide-details
            :rows="4"
          />
          <MoneyField
            v-model="amount"
            label="Coût total du repas"
            :min="1"
            :max="MAX_SHARED_MEAL_EXPENSE_AMOUNT"
          />
        </div>
      </template>
      <template #actions>
        <v-btn
          type="submit"
          text="Clore le repas"
          size="large"
          append-icon="mdi-cash-multiple"
          :disabled="!isFormValid"
        />
      </template>
    </DialogCard>
  </v-form>
</template>

<script lang="ts" setup>
import {
  MAX_SHARED_MEAL_EXPENSE_AMOUNT,
  type Expense,
  type OnGoingSharedMeal,
} from "@overbookd/personal-account";

const mealSharingStore = useMealSharingStore();

const { meal } = defineProps({
  meal: {
    type: Object as PropType<OnGoingSharedMeal>,
    required: true,
  },
});

const isFormValid = ref<boolean>(false);
const amount = ref<number>(0);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const recordExpense = () => {
  const mealId = meal.id;
  const expense: Expense = { amount: amount.value };
  mealSharingStore.recordExpense(mealId, expense);
  close();
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

<template>
  <DialogCard @close="close">
    <template #title> Dépense du repas </template>
    <template #subtitle>
      <h3>{{ shared.meal.date }}</h3>
    </template>
    <template #content>
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
      </form>
    </template>
    <template #actions>
      <v-btn
        text="Renseigner"
        color="primary"
        size="large"
        variant="elevated"
        append-icon="mdi-cash-multiple"
        @click="recordExpense"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { OnGoingSharedMeal } from "@overbookd/personal-account";

const mealSharingStore = useMealSharingStore();

const props = defineProps({
  shared: {
    type: Object as PropType<OnGoingSharedMeal>,
    required: true,
  },
});

const date = ref<Date>(new Date());
const amount = ref<number>(0);

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

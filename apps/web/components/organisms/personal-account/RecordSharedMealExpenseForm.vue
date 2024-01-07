<template>
  <v-card>
    <v-btn v-if="closable" class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title id="expense-meal">
      <h2>Dépense du repas</h2>
      <h3>{{ shared.meal.date }}</h3>
    </v-card-title>
    <v-card-text>
      <v-textarea
        outlined
        label="Au menu 🍴"
        :value="shared.meal.menu"
        readonly
        hide-details
        :rows="4"
      ></v-textarea>
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
        <v-btn color="primary" large @click="recordExpense">
          Renseigner <v-icon right>mdi-cash-multiple</v-icon>
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { OnGoingSharedMeal } from "@overbookd/personal-account";
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";

type RecordSharedMealExpenseFormData = {
  date: Date;
  amount: number;
};

export default defineComponent({
  name: "RecordSharedMealExpenseForm",
  components: { DateTimeField, MoneyField },
  props: {
    closable: {
      type: Boolean,
      default: () => false,
    },
    shared: {
      type: Object as () => OnGoingSharedMeal,
      required: true,
    },
  },
  emits: ["close-dialog"],
  data: (): RecordSharedMealExpenseFormData => ({
    date: new Date(),
    amount: 0,
  }),
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    recordExpense() {
      const mealId = this.shared.id;
      const expense = { amount: this.amount, date: this.date };
      this.$accessor.mealSharing.recordExpense({ mealId, expense });
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
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

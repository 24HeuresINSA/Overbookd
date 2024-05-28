<template>
  <v-card class="break-period-card">
    <v-btn class="break-period-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="break-period-card__title">
      <h2>Ajouter un temps de pause au bénévole</h2>
    </v-card-title>
    <v-card-subtitle>
      Les temps de pause permettent de ne pas affecter le bénévole à un créneau
      pendant sa pause.
    </v-card-subtitle>

    <v-card-text>
      <form>
        <DateTimeField :date="start" disabled hide-details />
        <v-text-field
          :value="duration.inHours"
          type="number"
          label="Durée en heures"
          suffix="h"
          :rules="[rules.number, rules.min]"
          @input="castInDuration"
        />
      </form>
    </v-card-text>

    <v-card-actions class="instructions-card__actions">
      <v-btn :disabled="!canAdd" color="primary" large @click="add">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter la pause
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Duration } from "@overbookd/period";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

type CreateBreakPeriodCardData = InputRulesData & {
  duration: Duration;
};

export default defineComponent({
  name: "CreateBreakPeriodCard",
  components: { DateTimeField },
  props: {
    start: {
      type: Date,
      required: true,
    },
  },
  emits: ["close-dialog", "create"],
  data: (): CreateBreakPeriodCardData => ({
    duration: Duration.hours(2),
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    canAdd(): boolean {
      return this.duration.inHours >= 1;
    },
  },
  methods: {
    castInDuration(hours: number) {
      this.duration = Duration.hours(hours);
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    add() {
      if (!this.canAdd) return;

      const during = { start: this.start, duration: this.duration };
      this.$emit("create", during);
    },
  },
});
</script>

<style lang="scss" scoped>
.break-period-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  form {
    display: flex;
    gap: 10px;
  }
}
</style>

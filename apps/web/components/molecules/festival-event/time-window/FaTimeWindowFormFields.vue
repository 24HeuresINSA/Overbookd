<template>
  <div>
    <h3>Début du créneau</h3>
    <DateTimeField
      :date="start"
      label="Début"
      @enter="enterKeyDown"
      @change="updateStart"
    />

    <h3>Fin du créneau</h3>
    <DateTimeField
      :date="end"
      label="Fin"
      :error-messages="errors"
      @enter="enterKeyDown"
      @change="updateEnd"
    />
  </div>
</template>

<script lang="ts">
import { IProvidePeriod, Period } from "@overbookd/period";
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";

export default defineComponent({
  name: "FaTimeWindowFormFields",
  components: { DateTimeField },
  props: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  computed: {
    period(): IProvidePeriod {
      return {
        start: this.start,
        end: this.end,
      };
    },
    errors(): string[] {
      return Period.errors(this.period);
    },
  },
  methods: {
    updateStart(start: Date) {
      this.$emit("update-start", start);
    },
    updateEnd(end: Date) {
      this.$emit("update-end", end);
    },
    enterKeyDown() {
      this.$emit("enter");
    },
  },
});
</script>

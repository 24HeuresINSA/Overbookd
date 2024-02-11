<template>
  <div>
    <PeriodFormFields
      :start="start"
      :end="end"
      @update:start="updateStart"
      @update:end="updateEnd"
    />

    <h3>Découpage du créneau (par heures)</h3>
    <v-checkbox :value="toSplit" label="Découper" @change="updateToSplit" />
    <v-slider
      :value="durationSplitInHour"
      :disabled="!toSplit"
      min="0.5"
      max="4"
      step="0.5"
      thumb-label="always"
      @change="updateDurationSplitInHour"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PeriodFormFields from "~/components/molecules/period/PeriodFormFields.vue";

type MobilizationPeriodFormFieldsData = {
  toSplit: boolean;
};

const DEFAULT_DURATION_SPLIT_VALUE = 2;

export default defineComponent({
  name: "MobilizationPeriodFormFields",
  components: { PeriodFormFields },
  emits: ["update:start", "update:end", "update:duration-split-in-hour"],
  props: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    durationSplitInHour: {
      type: Number,
      required: true,
    },
  },
  data: (): MobilizationPeriodFormFieldsData => ({
    toSplit: false,
  }),
  mounted() {
    this.updateToSplit(this.durationSplitInHour === null);
  },
  methods: {
    updateStart(start: Date) {
      this.$emit("update:start", start);
    },
    updateEnd(end: Date) {
      this.$emit("update:end", end);
    },
    updateDurationSplitInHour(durationSplitInHour: number | null) {
      this.$emit("update:duration-split-in-hour", durationSplitInHour);
    },
    updateToSplit(toSplit: boolean) {
      this.toSplit = toSplit;
      if (!toSplit) this.updateDurationSplitInHour(null);
      this.updateDurationSplitInHour(DEFAULT_DURATION_SPLIT_VALUE);
    },
  },
});
</script>

<template>
  <v-text-field
    :value="value"
    :label="label"
    type="datetime-local"
    :min="min"
    :max="max"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateForComponent } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "DateField",
  model: {
    prop: "date",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Date",
    },
    date: {
      type: String,
      default: null,
    },
    min: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    manifDate: "",
  }),
  computed: {
    value(): string | null {
      if (!this.date) return this.manifDate;
      return this.date;
    },
  },
  mounted() {
    const date = this.$accessor.config.getConfig("event_date");
    let formattedDate = formatDateForComponent(new Date(date));
    formattedDate = formattedDate.replace(/T\d\d:\d\d/, "T00:00");
    this.manifDate = formattedDate;
  },
  methods: {
    propagateEvent(date: string | null) {
      this.$emit("change", this.roundMinutes(date));
    },
    roundMinutes(date: string | null): string | null {
      if (!date) return null;

      const dateObj = new Date(date);
      const minutes = dateObj.getMinutes();
      if (minutes % 15 === 0) return date;

      const minutesRounded = Math.round(minutes / 15) * 15;
      dateObj.setMinutes(minutesRounded);
      return formatDateForComponent(dateObj);
    },
  },
});
</script>

<template>
  <div class="timeline-form">
    <div>
      <h3>Début de la plage horaire</h3>
      <DateTimeField v-model="start" label="Début" />
    </div>

    <div>
      <h3>Fin de la plage horaire</h3>
      <DateTimeField v-model="end" label="Fin" />
    </div>

    <v-btn color="success" class="btn" @click="updateTimelineFilter">
      Appliquer
    </v-btn>

    <v-text-field
      v-model="search"
      append-icon="mdi-outline-search"
      label="Nom de la tache"
      autofocus
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { Period } from "~/utils/models/period";

export default Vue.extend({
  name: "TimelineForm",
  components: { DateTimeField },
  data() {
    return {
      start: new Date(),
      end: new Date(),
    };
  },
  computed: {
    period(): Period {
      return {
        start: this.start,
        end: this.end,
      };
    },
    search: {
      get(): string {
        return this.$accessor.timeline.search;
      },
      set(value: string | null) {
        this.$accessor.timeline.updateSearch(value);
      },
    },
  },
  created() {
    this.start = this.$accessor.timeline.start;
    this.end = this.$accessor.timeline.end;
  },
  methods: {
    updateTimelineFilter() {
      this.$accessor.timeline.updatePeriod(this.period);
    },
  },
});
</script>

<style lang="scss" scoped>
.timeline-form {
  display: flex;
  gap: 70px;
  align-items: center;
}
</style>

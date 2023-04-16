<template>
  <div class="orga-needs">
    <div>
      <h1>Rapport des besoins en orgas</h1>
    </div>
    <v-card-text class="datepicker">
      <div>
        <h3>Début du créneau</h3>
        <DateTimeField v-model="start" label="Début"></DateTimeField>
      </div>

      <div>
        <h3>Fin du créneau</h3>
        <DateTimeField v-model="end" label="Fin"></DateTimeField>
      </div>

      <v-btn color="success" class="btn" @click="updateStats"> Appliquer</v-btn>
    </v-card-text>
    <OrgaNeedsChart></OrgaNeedsChart>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimeField from "~/components/atoms/DateTimeField.vue";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";
import OrgaNeedsChart from "~/components/organisms/orga-needs/OrgaNeedsChart.vue";

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

export default Vue.extend({
  name: "OrgaNeeds",
  components: { DateTimeField, OrgaNeedsChart },
  data() {
    return {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined,
    };
  },
  computed: {
    stats(): OrgaNeedsResponse[] {
      return this.$accessor.orgaNeeds.stats;
    },
  },
  mounted() {
    const eventDate = new Date(this.$accessor.config.getConfig("event_date"));
    this.start = new Date(eventDate.getTime() - THREE_DAYS_IN_MS);
    this.end = new Date(eventDate.getTime() + THREE_DAYS_IN_MS);
    this.$accessor.orgaNeeds.fetchStats({ start: this.start, end: this.end });
  },
  methods: {
    updateStats() {
      this.$accessor.orgaNeeds.fetchStats({ start: this.start, end: this.end });
    },
  },
});
</script>

<style scoped>
.datepicker {
  display: flex;
  gap: 2rem;
  align-items: center;
}
</style>

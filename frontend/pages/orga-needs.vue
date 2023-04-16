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
    </v-card-text>
    <table>
      <thead>
        <th>Date</th>
        <th>Bénévoles Disponibles</th>
        <th>Bénévoles Requis</th>
        <th>Bénévoles Assignés</th>
      </thead>
      <tbody class="table-body">
        <tr
          v-for="(stat, index) in stats"
          :key="index"
          :style="`color: ${getColor(stat)}`"
        >
          <td>{{ stat.start.toLocaleString() }}</td>
          <td>{{ stat.availableVolunteers }}</td>
          <td>{{ stat.requestedVolunteers }}</td>
          <td>{{ stat.assignedVolunteers }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimeField from "~/components/atoms/DateTimeField.vue";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

export default Vue.extend({
  name: "OrgaNeeds",
  components: { DateTimeField },
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
    getColor(stat: OrgaNeedsResponse) {
      if (stat.assignedVolunteers >= stat.requestedVolunteers) {
        return "#0066ff";
      } else if (stat.availableVolunteers >= stat.requestedVolunteers + 5) {
        return "green";
      } else if (stat.availableVolunteers >= stat.requestedVolunteers) {
        return "#00cc66";
      } else if (stat.availableVolunteers >= stat.requestedVolunteers - 5) {
        return "#ff7f7f";
      } else {
        return "red";
      }
    },
  },
});
</script>

<style scoped>
.datepicker {
  display: flex;
  gap: 2rem;
}

.table-body {
  text-align-last: right;
}

td {
  padding: 0 15px;
}
</style>

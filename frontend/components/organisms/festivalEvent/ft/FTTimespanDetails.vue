<template>
  <v-card class="timespan-details">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>{{ task }}</v-card-title>
    <v-card-text class="timespan-details__content">
      <div class="timespan-metadata">
        <v-chip color="primary">
          <v-icon left>mdi-map-marker</v-icon>
          <span>{{ location }}</span>
        </v-chip>
        <v-chip color="primary">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ timetable }}</span>
        </v-chip>
      </div>
      <div class="assignees">
        <h2>Bénévoles affectés sur le créneau</h2>
        <v-data-table
          :headers="headers"
          :items="assignees"
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
        >
          <template #item.volunteer="{ item }">
            <v-chip
              class="assignee-chip"
              @click="openCalendarInNewTab(item.id)"
            >
              {{ item.firstname }} {{ item.lastname }}
            </v-chip>
          </template>
          <template #item.teams="{ item }">
            <TeamChip
              v-for="team in item.teams"
              :key="team"
              :team="team"
              class="assignee-team"
            ></TeamChip>
          </template>
          <template #item.assignedTeam="{ item }">
            <TeamChip
              v-if="item.assignedTeam"
              :team="item.assignedTeam"
              size="medium"
              with-name
            ></TeamChip>
            <v-chip v-else>Requis</v-chip>
          </template>
          <template #item.phone="{ item }">
            <div class="assignee-phone">
              <v-btn icon :href="getPhoneLink(item.phone)">
                <v-icon>mdi-phone</v-icon>
              </v-btn>
              <h3>{{ formatPhone(item.phone) }}</h3>
            </div>
          </template>
          <template #no-data> Aucun bénévole affecté sur ce créneau </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatDateToHumanReadable } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/Data";
import { TimespanWithAssignees } from "~/utils/models/ftTimespan";
import { User } from "~/utils/models/user";
import { formatUserPhone, formatPhoneLink } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "FTTimespanDetails",
  components: { TeamChip },
  computed: {
    timespan(): TimespanWithAssignees | null {
      return this.$accessor.assignment.timespanToDisplayDetails;
    },
    task(): string {
      if (!this.timespan) return "";
      return `[${this.timespan.ft.id}] ${this.timespan.ft.name}`;
    },
    location(): string {
      if (!this.timespan) return "";
      return this.timespan.ft.location;
    },
    timetable(): string {
      if (!this.timespan) return "";
      const start = formatDateToHumanReadable(this.timespan.start);
      const end = formatDateToHumanReadable(this.timespan.end);
      return `${start} - ${end}`;
    },
    assignees(): User[] {
      if (!this.timespan) return [];
      return [...this.timespan.requiredVolunteers, ...this.timespan.assignees];
    },
    headers(): Header[] {
      const volunteer = {
        text: "Bénévole",
        value: "volunteer",
        width: "300px",
        sortable: false,
      };
      const teams = {
        text: "Equipes",
        value: "teams",
        sortable: false,
      };
      const assignedTeam = {
        text: "Affecté en tant que",
        value: "assignedTeam",
        sortable: false,
      };
      const phone = {
        text: "Téléphone",
        value: "phone",
        sortable: false,
      };
      return [volunteer, teams, assignedTeam, phone];
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    openCalendarInNewTab(assigneeId: number) {
      window.open(`/calendar/${assigneeId}`, "_blank");
    },
    formatPhone(phone: string) {
      return formatUserPhone(phone);
    },
    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },
  },
});
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}

.assignee-chip {
  cursor: pointer;
}

.timespan-metadata {
  display: flex;
  gap: 15px;
}

.timespan-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
  }
}

.assignee-team {
  margin-left: 4px;
}

.assignee-phone {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: 750px) {
  .timespan-metadata {
    flex-direction: column;
  }

  .timespan-metadata > .v-chip {
    height: fit-content;
    min-height: 32px;
    white-space: pre-wrap;
  }
}
</style>

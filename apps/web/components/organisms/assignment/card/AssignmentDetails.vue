<template>
  <v-card class="assignment-details">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>
      {{ taskName }}
      <v-icon right @click="openFtInNewTab">mdi-open-in-new</v-icon>
    </v-card-title>
    <v-card-text class="assignment-details__content">
      <div class="assignment-metadata">
        <v-chip color="primary">
          <v-icon left>mdi-map-marker</v-icon>
          <span>{{ location }}</span>
        </v-chip>
        <v-chip color="primary">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ timetable }}</span>
        </v-chip>
        <TeamChip
          v-for="{ team, demand, assigned } in requestedTeams"
          :key="team"
          :team="team"
          :prefix="`${assigned}/${demand}`"
          size="medium"
          with-name
          show-hidden
        ></TeamChip>
      </div>
      <div class="required-volunteers">
        <h2>Bénévoles requis sur le créneau</h2>
        <div class="volunteer-list">
          <v-chip
            v-for="requiredVolunteer in requiredVolunteers"
            :key="requiredVolunteer.id"
            @click="openCalendarInNewTab(requiredVolunteer.id)"
          >
            <v-icon left>mdi-account</v-icon>
            <span
              >{{ requiredVolunteer.firstname }}
              {{ requiredVolunteer.lastname }}</span
            >
          </v-chip>
        </div>
        <p v-if="requiredVolunteers.length === 0">
          Aucun bénévole requis spécifiquement sur ce créneau
        </p>
      </div>
      <div class="assignees">
        <h2>Bénévoles affectés sur le créneau</h2>
        <v-data-table
          :headers="headers"
          :items="assignees"
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          :value="selectedAssignee"
        >
          <template #item.firstname="{ item }">
            {{ item.firstname }} {{ item.lastname }}
            <v-tooltip top max-width="20rem">
              <template #activator="{ on, attrs }">
                <v-icon v-if="item?.note" small v-bind="attrs" v-on="on">
                  mdi-note
                </v-icon>
              </template>
              <span>{{ item?.note }}</span>
            </v-tooltip>
            <v-tooltip top max-width="20rem">
              <template #activator="{ on, attrs }">
                <v-icon v-if="item?.comment" small v-bind="attrs" v-on="on">
                  mdi-comment
                </v-icon>
              </template>
              <span>{{ item?.comment }}</span>
            </v-tooltip>
            <TeamChip
              v-for="team in item.teams"
              :key="team"
              :team="team"
              class="assignees__assignee-team"
            ></TeamChip>
          </template>
          <template #item.assignedTeam="{ item }">
            <TeamChip
              :team="item.as"
              size="medium"
              with-name
              show-hidden
            ></TeamChip>
          </template>
          <template #item.friends="{ item }">
            <div class="friend-list">
              <v-chip v-for="friend in item.friends" :key="friend.id">
                <v-icon left>mdi-account</v-icon>
                <span>{{ friend.firstname }} {{ friend.lastname }}</span>
              </v-chip>
            </div>
          </template>
          <template #item.assignmentDuration="{ item }">
            {{ formatDuration(item.assignmentDuration) }}
          </template>
          <template #item.actions="{ item }">
            <div class="assignees__actions">
              <v-btn icon @click="openCalendarInNewTab(item.id)">
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
              <v-btn icon @click="unassignVolunteer(item)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </template>
          <template #no-data> Aucun bénévole affecté sur ce créneau </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import {
  AssignmentTeam,
  AssignmentWithDetails,
  NamelyDemandedForDetails,
  TeamMemberForDetails,
  isTeamMember,
} from "@overbookd/assignment";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { Duration } from "@overbookd/period";

export default defineComponent({
  name: "AssignmentDetails",
  components: { TeamChip },
  props: {
    assignmentDetails: {
      type: Object as () => AssignmentWithDetails,
      required: true,
    },
  },
  emits: ["close-dialog", "unassign"],
  data: () => ({
    selectedAssigneeId: null as number | null,
    selectedTeamToAssign: null as string | null,
  }),
  computed: {
    taskName(): string {
      if (this.assignmentDetails === null) return "";
      return `[${this.assignmentDetails.taskId}] ${this.assignmentDetails.name}`;
    },
    location(): string {
      if (!this.assignmentDetails) return "";
      return this.assignmentDetails.appointment;
    },
    timetable(): string {
      if (!this.assignmentDetails) return "";
      const start = formatDateToHumanReadable(this.assignmentDetails.start);
      const end = formatDateToHumanReadable(this.assignmentDetails.end);
      return `${start} - ${end}`;
    },
    requestedTeams(): AssignmentTeam[] {
      if (!this.assignmentDetails) return [];
      return this.assignmentDetails.demands.map(({ demand, team }) => {
        const assigned = this.assignmentDetails.assignees.filter(
          (assignee) => "as" in assignee && assignee.as === team,
        ).length;
        return { team, demand, assigned };
      });
    },
    requiredVolunteers(): NamelyDemandedForDetails[] {
      if (!this.assignmentDetails) return [];

      return this.assignmentDetails.assignees
        .map((requiredVolunteer) => {
          if (!isTeamMember(requiredVolunteer)) {
            return requiredVolunteer;
          }
        })
        .filter(
          (requiredVolunteer): requiredVolunteer is NamelyDemandedForDetails =>
            requiredVolunteer !== undefined,
        );
    },
    assignees(): TeamMemberForDetails[] {
      if (!this.assignmentDetails) return [];

      return this.assignmentDetails.assignees
        .map((assignee) => {
          if (isTeamMember(assignee)) {
            return assignee;
          }
        })
        .filter(
          (assignee): assignee is TeamMemberForDetails =>
            assignee !== undefined,
        );
    },
    isUpdateAssignedTeamActive(): boolean {
      return this.selectedAssigneeId !== null;
    },
    headers(): Header[] {
      const volunteer = {
        text: "Bénévole",
        value: "firstname",
        width: "300px",
      };
      const assignedTeam = {
        text: "Affecté en tant que",
        value: "assignedTeam",
        sortable: false,
      };
      const friends = {
        text: "Amis affectés",
        value: "friends",
        sortable: false,
      };
      const assignmentDuration = {
        text: "Affectation totale",
        value: "assignmentDuration",
      };
      const actions = { text: "Actions", value: "actions", sortable: false };
      if (this.isUpdateAssignedTeamActive) {
        return [volunteer, assignedTeam, assignmentDuration, actions];
      }
      return [volunteer, assignedTeam, friends, assignmentDuration, actions];
    },
    isOrgaTaskMode(): boolean {
      return isOrgaTaskMode(this.$route.path);
    },
    selectedAssignee(): [TeamMemberForDetails] | [] {
      if (!this.isOrgaTaskMode) return [];
      const assignee = this.$accessor.assignVolunteerToTask.selectedVolunteer;
      const assigneeForDetails = this.assignees.find(
        ({ id }) => id === assignee?.id,
      );
      if (!assigneeForDetails) return [];
      return [assigneeForDetails];
    },
  },
  methods: {
    unassignVolunteer(teamMember: TeamMemberForDetails) {
      if (!this.assignmentDetails) return;
      const assignmentIdentifier = {
        assignmentId: this.assignmentDetails.assignmentId,
        taskId: this.assignmentDetails.taskId,
        mobilizationId: this.assignmentDetails.mobilizationId,
      };

      this.$emit("unassign", {
        assignmentIdentifier,
        assigneeId: teamMember.id,
      });
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    openFtInNewTab() {
      if (!this.assignmentDetails) return;
      const ftId = this.assignmentDetails.taskId;
      window.open(`/ft/${ftId}`, "_blank");
    },
    openCalendarInNewTab(assigneeId: number) {
      window.open(`/planning/${assigneeId}`, "_blank");
    },
    formatDuration(duration: number): string {
      return Duration.ms(duration).toString();
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

.assignment-metadata {
  display: flex;
  gap: 15px;
}

.assignment-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
    .friend-list {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 4px 0;
    }
  }
}

.assignees {
  &__assignee-team {
    margin-left: 4px;
  }
  &__actions {
    display: block ruby;
  }
}

.volunteer-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
</style>

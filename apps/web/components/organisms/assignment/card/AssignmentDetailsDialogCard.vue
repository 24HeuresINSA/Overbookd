<template>
  <DialogCard without-actions @close="close">
    <template #title>
      {{ taskName }}
      <v-icon
        icon="mdi-open-in-new"
        aria-label="Ouvrir dans un nouvel onglet"
        title="Ouvrir dans un nouvel onglet"
        size="x-small"
        @click="openTaskInNewTab"
      />
    </template>

    <template #content>
      <div class="assignment-details__content">
        <div class="assignment-metadata">
          <v-chip
            color="primary"
            variant="elevated"
            class="assignment-metadata__chip"
          >
            <v-icon icon="mdi-map-marker" />
            <span>{{ location }}</span>
          </v-chip>
          <v-chip
            color="primary"
            variant="elevated"
            class="assignment-metadata__chip"
          >
            <v-icon icon="mdi-clock" />
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
          />
        </div>

        <div class="required-volunteers">
          <h2>Bénévoles requis sur le créneau</h2>
          <div class="volunteer-list">
            <v-chip
              v-for="requiredVolunteer in requiredVolunteers"
              :key="requiredVolunteer.id"
              @click="openPlanningInNewTab(requiredVolunteer.id)"
            >
              <v-icon left>mdi-account</v-icon>
              <span>{{ buildUserName(requiredVolunteer) }} </span>
            </v-chip>
          </div>
          <p v-if="requiredVolunteers.length === 0">
            Aucun bénévole requis spécifiquement sur ce créneau
          </p>
        </div>

        <div class="assignees">
          <h2>Bénévoles affectés sur le créneau</h2>
          <v-data-table
            :headers="tableHeaders"
            :items="assignees"
            :items-per-page="-1"
            disable-pagination
            hide-default-footer
            :value="selectedAssignee"
            no-data-text="Aucun bénévole affecté sur ce créneau"
          >
            <template #item.firstname="{ item }">
              {{ buildUserName(item) }}
              <v-icon
                v-if="item?.note"
                v-tooltip:top="item?.note"
                icon="mdi-note"
                :aria-label="item?.note"
                size="small"
              />
              <v-icon
                v-if="item?.comment"
                v-tooltip:top="item?.comment"
                icon="mdi-comment"
                :aria-label="item?.comment"
                size="small"
              />
              <TeamChip
                v-for="team in item.teams"
                :key="team"
                :team="team"
                class="assignees__assignee-team"
              />
            </template>

            <template #item.assignedTeam="{ item }">
              <TeamChip :team="item.as" size="default" with-name show-hidden />
            </template>

            <template #item.friends="{ item }">
              <div class="friend-list">
                <v-chip
                  v-for="friend in item.friends"
                  :key="friend.id"
                  :color="shouldHighlight(friend.id) ? 'secondary' : undefined"
                  :variant="shouldHighlight(friend.id) ? 'elevated' : undefined"
                >
                  <v-icon left>mdi-account</v-icon>
                  {{ buildUserName(friend) }}
                </v-chip>
              </div>
            </template>

            <template #item.assignmentDuration="{ item }">
              {{ formatDuration(item.assignmentDuration) }}
            </template>

            <template #item.actions="{ item }">
              <div class="assignees__actions">
                <v-btn
                  icon="mdi-calendar"
                  aria-label="Ouvrir le planning"
                  title="Ouvrir le planning"
                  size="small"
                  density="comfortable"
                  variant="flat"
                  @click="openPlanningInNewTab(item.id)"
                />
                <v-btn
                  v-if="canUnassignVolunteer"
                  icon="mdi-close"
                  aria-label="Retirer l'affectation"
                  title="Retirer l'affectation"
                  size="small"
                  density="comfortable"
                  variant="flat"
                  @click="unassignVolunteer(item)"
                />
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  type AssignmentTeam,
  type AssignmentWithDetails,
  type NamelyDemandedForDetails,
  type TeamMemberForDetails,
  isTeamMember,
} from "@overbookd/assignment";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { buildUserName } from "@overbookd/user";
import { Duration, formatDateToHumanReadable } from "@overbookd/time";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { FT_URL, PLANNING_URL } from "@overbookd/web-page";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";

const route = useRoute();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const userStore = useUserStore();

const props = defineProps({
  assignmentDetails: {
    type: Object as PropType<AssignmentWithDetails>,
    required: true,
  },
  highlightedAssigneeId: {
    type: Number,
    default: undefined,
  },
});

const selectedAssigneeId = ref<number | undefined>();

const openTaskInNewTab = () => {
  openPageWithIdInNewTab(FT_URL, props.assignmentDetails.taskId);
};

const taskName = computed<string>(
  () => `[${props.assignmentDetails.taskId}] ${props.assignmentDetails.name}`,
);
const location = computed<string>(() => props.assignmentDetails.appointment);
const timetable = computed<string>(() => {
  const start = formatDateToHumanReadable(props.assignmentDetails.start);
  const end = formatDateToHumanReadable(props.assignmentDetails.end);
  return `${start} - ${end}`;
});
const requestedTeams = computed<AssignmentTeam[]>(() =>
  props.assignmentDetails.demands.map(({ demand, team }) => {
    const assigned = props.assignmentDetails.assignees.filter(
      (assignee) => "as" in assignee && assignee.as === team,
    ).length;
    return { team, demand, assigned };
  }),
);

const shouldHighlight = (assigneeId: number): boolean => {
  return props.highlightedAssigneeId === assigneeId;
};
function prioritizeHighlighted<T extends { id: number }>(list: T[]): T[] {
  if (props.highlightedAssigneeId === undefined) return list;
  return list.sort((a, b) =>
    shouldHighlight(a.id) ? -1 : shouldHighlight(b.id) ? 1 : 0,
  );
}

const requiredVolunteers = computed<NamelyDemandedForDetails[]>(() => {
  const list = props.assignmentDetails.assignees.filter(
    (a): a is NamelyDemandedForDetails => !isTeamMember(a),
  );
  return prioritizeHighlighted(list);
});
const assignees = computed<TeamMemberForDetails[]>(() => {
  const list = props.assignmentDetails.assignees.filter(
    (a): a is TeamMemberForDetails => isTeamMember(a),
  );
  return prioritizeHighlighted(list);
});

const isUpdateAssignedTeamActive = computed<boolean>(
  () => selectedAssigneeId.value !== undefined,
);

const tableHeaders = computed<TableHeaders>(() => {
  const volunteer = {
    title: "Bénévole",
    value: "firstname",
    width: "300px",
    sortable: true,
  };
  const assignedTeam = { title: "Affecté en tant que", value: "assignedTeam" };
  const friends = { title: "Amis affectés", value: "friends" };
  const assignmentDuration = {
    title: "Affectation totale",
    value: "assignmentDuration",
    sortable: true,
  };
  const actions = { title: "Actions", value: "actions" };

  return isUpdateAssignedTeamActive.value
    ? [volunteer, assignedTeam, assignmentDuration, actions]
    : [volunteer, assignedTeam, friends, assignmentDuration, actions];
});

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));
const selectedAssignee = computed<TeamMemberForDetails[]>(() => {
  if (!isOrgaTask.value) return [];
  const assignee = assignVolunteerToTaskStore.selectedVolunteer;
  const assigneeForDetails = assignees.value.find(
    ({ id }) => id === assignee?.id,
  );
  return assigneeForDetails ? [assigneeForDetails] : [];
});

const emit = defineEmits(["close", "unassign"]);

const canUnassignVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
userStore;
const unassignVolunteer = (teamMember: TeamMemberForDetails) => {
  const assignmentIdentifier = {
    assignmentId: props.assignmentDetails.assignmentId,
    taskId: props.assignmentDetails.taskId,
    mobilizationId: props.assignmentDetails.mobilizationId,
  };
  emit("unassign", { assignmentIdentifier, assigneeId: teamMember.id });
};

const close = () => emit("close");

const openPlanningInNewTab = (assigneeId: number) => {
  window.open(`${PLANNING_URL}/${assigneeId}`);
};

const formatDuration = (duration: number): string => {
  return Duration.ms(duration).toString();
};
</script>

<style lang="scss" scoped>
.assignment-metadata {
  display: flex;
  gap: 15px;
  &__chip {
    .v-icon {
      margin-right: 5px;
    }
  }
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
    display: flex;
    gap: 5px;
  }
}

.volunteer-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
</style>

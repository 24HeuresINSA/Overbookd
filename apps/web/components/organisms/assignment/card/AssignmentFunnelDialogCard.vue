<template>
  <DialogCard @close="close">
    <template #title>
      {{ taskTitle }}
      <v-icon icon="mdi-open-in-new" size="small" @click="openTaskInNewTab" />
    </template>
    <template #content>
      <OverMultiCalendar
        v-model="day"
        :volunteers="candidatesForCalendar"
        :event-to-add="assignmentAsEvent"
      >
        <template #additional-actions>
          <v-btn
            :disabled="!funnel?.canFulfillMoreRemainingDemands"
            color="success"
            icon="mdi-account-multiple-plus"
            rounded="pill"
            size="small"
            @click="addCandidate"
          />
          <v-btn
            :disabled="!funnel?.canAssign"
            color="success"
            prepend-icon="mdi-checkbox-marked-circle-outline"
            text="Affecter"
            @click="assign"
          />
        </template>
        <template #volunteer-header>
          <div v-if="funnel" class="volunteer-headers">
            <CandidateForAssignmentHeader
              v-for="candidate in candidatesForCalendar"
              :key="candidate.id"
              :candidate="candidate"
              :funnel="funnel"
              class="volunteer-header"
              @revoke="revokeLastCandidate"
              @next="nextCandidate"
              @previous="previousCandidate"
              @temporary-assign="temporaryAssign"
            />
          </div>
        </template>
      </OverMultiCalendar>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  type IActAsFunnel,
  ReadyToStart,
  type AssignableVolunteer,
  type Assignment,
  type IDefineCandidate,
} from "@overbookd/assignment";
import { FT_URL } from "@overbookd/web-page";
import { convertToCalendarBreak } from "~/domain/common/break-events";
import { getColorByStatus } from "~/domain/common/status-color";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { candidateFactory } from "~/utils/assignment/funnel";
import {
  type CalendarEvent,
  createCalendarEvent,
} from "~/utils/calendar/event";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";

const props = defineProps({
  assignment: {
    type: Object as PropType<Assignment>,
    required: true,
  },
  volunteer: {
    type: Object as PropType<AssignableVolunteer>,
    required: true,
  },
});

const funnel = ref<IActAsFunnel | null>(null);
onMounted(async () => {
  funnel.value = await ReadyToStart.init(
    candidateFactory(),
    new AssignmentsRepository(),
  )
    .select(props.assignment)
    .select(props.volunteer);
});

const day = ref<Date>(props.assignment.start);

const taskTitle = computed(() => {
  const { taskId, name } = props.assignment;
  return `[${taskId}] ${name}`;
});
const openTaskInNewTab = () => {
  openPageWithIdInNewTab(FT_URL, props.assignment.taskId);
};

const candidatesForCalendar = computed<VolunteerForCalendar[]>(() => {
  if (!funnel.value) return [];
  return funnel.value.candidates.map((candidate) => ({
    ...candidate,
    assignments: [
      ...retreiveCandidateTasksAsEvents(candidate),
      ...retrieveCandidateBreaksAsEvents(candidate),
    ],
  }));
});
const retreiveCandidateTasksAsEvents = (
  candidate: IDefineCandidate,
): CalendarEvent[] => {
  return candidate.planning.map((assignment) => {
    return createCalendarEvent({
      start: assignment.start,
      end: assignment.end,
      name: assignment.task.name,
      color: getColorByStatus(assignment.task.status),
    });
  });
};
const retrieveCandidateBreaksAsEvents = (
  candidate: IDefineCandidate,
): CalendarEvent[] => {
  return candidate.breakPeriods.map(convertToCalendarBreak);
};
const assignmentAsEvent = computed<CalendarEvent>(() => {
  return createCalendarEvent({
    start: props.assignment.start,
    end: props.assignment.end,
    name: props.assignment.name,
  });
});

const addCandidate = async () => {
  if (!funnel.value?.canFulfillMoreRemainingDemands) return;
  funnel.value = await funnel.value.addCandidate();
};
const revokeLastCandidate = async () => {
  if (!funnel.value?.canRevokeLastCandidate) return;
  funnel.value = await funnel.value.revokeLastCandidate();
};
const nextCandidate = async () => {
  if (!funnel.value?.canChangeLastCandidate) return;
  funnel.value = await funnel.value.nextCandidate();
};
const previousCandidate = async () => {
  if (!funnel.value?.canChangeLastCandidate) return;
  funnel.value = await funnel.value.previousCandidate();
};
const temporaryAssign = (team: string, candidate: VolunteerForCalendar) => {
  if (!funnel.value) return;
  funnel.value = funnel.value.fulfillDemand({
    volunteer: candidate.id,
    team,
  });
};

const emit = defineEmits(["volunteers-assigned", "close"]);
const assign = async () => {
  if (!funnel.value || !funnel.value.canAssign) return;
  await funnel.value.assign();
  emit("volunteers-assigned", props.assignment);
  close();
};
const close = () => emit("close");

const handleKeydown = (event: KeyboardEvent) => {
  if (["Backspace", "Delete"].includes(event.key)) revokeLastCandidate();
  else if (["=", "+"].includes(event.key)) addCandidate();
  else if (event.key === "Enter") assign();
  else if (event.key === "ArrowUp") {
    event.preventDefault();
    previousCandidate();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    nextCandidate();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped lang="scss">
@use "~/assets/calendar.scss" as *;

.volunteer-headers {
  display: flex;
}
</style>

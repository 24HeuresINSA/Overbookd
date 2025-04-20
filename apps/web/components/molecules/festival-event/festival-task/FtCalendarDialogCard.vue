<template>
  <DialogCard without-actions @close="closeCalendar">
    <template #title> Créneaux de la tâche </template>
    <template #content>
      <OverCalendar
        v-model="calendarMarker"
        :events="filteredAllTimeWindowEvents"
        clickable-events
        @click:event="openAssignmentDetailsDialog"
      >
        <template #additional-actions>
          <v-switch
            v-model="displayActivityEvents"
            color="primary"
            label="Animations"
          />
          <v-switch
            v-model="displayInquiryEvents"
            color="secondary"
            label="Matos"
          />
          <v-switch
            v-if="!isReadyToAssign(selectedTask)"
            v-model="displayMobilizationOrAssignmentEvents"
            color="tertiary"
            label="Mobilisations"
          />
          <v-switch
            v-else
            v-model="displayMobilizationOrAssignmentEvents"
            :color="READY_TO_ASSIGN_COLOR"
            label="Affectations"
          />
        </template>
      </OverCalendar>
    </template>
  </DialogCard>

  <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
    <AssignmentDetailsDialogCard
      v-if="assignmentDetails"
      :assignment-details="assignmentDetails"
      @close="closeAssignmentDetailsDialog"
      @unassign="unassignVolunteer"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { AssignmentWithDetails } from "@overbookd/assignment";
import {
  isReadyToAssign,
  type FestivalTask,
  type Mobilization,
} from "@overbookd/festival-event";
import type { UnassignForm } from "~/utils/assignment/assignment";
import {
  hasAssignmentIdentifier,
  type CalendarEventWithIdentifier,
} from "~/utils/assignment/calendar-event";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { READY_TO_ASSIGN_COLOR } from "~/utils/vuetify/theme/common";

const configurationStore = useConfigurationStore();
const ftStore = useFestivalTaskStore();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);

const calendarMarker = ref<Date>(configurationStore.eventStartDate);
const displayActivityEvents = ref<boolean>(false);
const displayInquiryEvents = ref<boolean>(false);
const displayMobilizationOrAssignmentEvents = ref<boolean>(true);

const filteredAllTimeWindowEvents = computed<CalendarEvent[]>(() => {
  return [
    ...filteredActivityEvents.value,
    ...filteredInquiryEvents.value,
    ...filteredMobilizationEvents.value,
    ...filteredAssignmentEvents.value,
  ];
});

const filteredActivityEvents = computed<CalendarEvent[]>(() => {
  if (!displayActivityEvents.value) return [];

  return selectedTask.value.festivalActivity.timeWindows.map(
    ({ start, end }) => {
      const event = {
        start,
        end,
        name: selectedTask.value.festivalActivity.name,
        color: "primary",
      };
      return createCalendarEvent(event);
    },
  );
});
const filteredInquiryEvents = computed<CalendarEvent[]>(() => {
  if (!displayInquiryEvents.value) return [];

  return selectedTask.value.festivalActivity.inquiry.timeWindows.map(
    ({ start, end }) => {
      const event = {
        start,
        end,
        name: "Matos",
        color: "secondary",
      };
      return createCalendarEvent(event);
    },
  );
});
const filteredMobilizationEvents = computed<CalendarEvent[]>(() => {
  if (
    !displayMobilizationOrAssignmentEvents.value ||
    isReadyToAssign(selectedTask.value)
  )
    return [];

  return selectedTask.value.mobilizations.map(({ start, end }) => {
    const event = {
      start,
      end,
      name: selectedTask.value.general.name,
      color: "tertiary",
    };
    return createCalendarEvent(event);
  });
});
const filteredAssignmentEvents = computed<CalendarEventWithIdentifier[]>(() => {
  if (
    !displayMobilizationOrAssignmentEvents.value ||
    !isReadyToAssign(selectedTask.value)
  )
    return [];

  const taskId = selectedTask.value.id;
  const { name } = selectedTask.value.general;
  type WithAssignment = Mobilization<{
    withAssignments: true;
    withConflicts: false;
  }>;

  return selectedTask.value.mobilizations.flatMap(
    ({ assignments, id: mobilizationId }: WithAssignment) => {
      return assignments.map(
        ({ start, end, id: assignmentId }): CalendarEventWithIdentifier => {
          const identifier = { taskId, mobilizationId, assignmentId };
          const event = {
            start,
            end,
            name,
            color: READY_TO_ASSIGN_COLOR,
            identifier,
          };
          return createCalendarEvent(event);
        },
      );
    },
  );
});

const emit = defineEmits(["close"]);
const closeCalendar = () => emit("close");

const displayAssignmentDetailsDialog = ref<boolean>(false);
const openAssignmentDetailsDialog = async (
  event: CalendarEvent | CalendarEventWithIdentifier,
) => {
  if (!hasAssignmentIdentifier(event)) return;
  await ftStore.fetchAssignmentDetails(event.identifier);
  displayAssignmentDetailsDialog.value = true;
};
const closeAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = false;
};

const assignmentDetails = computed<AssignmentWithDetails | null>(() => {
  return ftStore.assignmentDetails;
});

const unassignVolunteer = (form: UnassignForm) => {
  ftStore.unassign(form);
};
</script>

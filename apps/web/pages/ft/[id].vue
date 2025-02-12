<template>
  <div class="ft task">
    <FestivalEventSidebar
      festival-event="FT"
      class="sidebar"
      @toggle="toggleSidebar"
    >
      <template #additional-actions>
        <v-btn
          v-if="canEnableAssignment"
          id="enable-assignment"
          :disabled="cantStartAssignment"
          @click="openEnableAssignment"
        >
          <v-icon class="mr-2">mdi-human-greeting</v-icon>
          <p v-show="!isSideBarClosed">Commencer l'affectation</p>
        </v-btn>
      </template>
    </FestivalEventSidebar>
    <article class="container">
      <FtGeneralCard id="general" :disabled="isValidatedOrReadyToAssign" />
      <ParentFaCard id="fa" @open:calendar="openCalendar" />
      <FtInquiryCard id="inquiry" :disabled="isValidatedOrReadyToAssign" />
      <InstructionsCard
        id="instructions"
        :disabled="isValidatedOrReadyToAssign"
      />
      <MobilizationCard
        id="mobilization"
        :disabled="isValidatedOrReadyToAssign"
        @open:calendar="openCalendar"
      />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedTask"
        @publish="publishFeedback"
      />
    </article>
  </div>

  <v-dialog v-model="isCalendarDialogOpen" max-width="1000">
    <DialogCard without-actions @close="closeCalendar">
      <template #title> Créneaux de la tâche </template>
      <template #content>
        <OverCalendar
          v-model="calendarMarker"
          :events="filteredAllTimeWindowEvents"
        >
          <template #additional-actions>
            <v-switch
              v-model="displayActivityEvents"
              color="primary"
              label="Animations"
            />
            <v-switch
              v-model="displeyInquiryEvents"
              color="secondary"
              label="Matos"
            />
            <v-switch
              v-model="displayMobilizationEvents"
              color="rgb(103, 58, 183)"
              label="Mobilisations"
            />
          </template>
        </OverCalendar>
      </template>
    </DialogCard>
  </v-dialog>

  <v-dialog v-model="isEnableAssignmentOpen" width="600">
    <CategorizeFormCard
      @close="closeEnableAssignment"
      @categorized="enableAssignment"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  type Categorize,
  type FestivalTask,
  isValidated,
  isReadyToAssign,
} from "@overbookd/festival-event";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { FT_URL } from "@overbookd/web-page";
import { useLiveNotification } from "~/composable/useLiveNotification";
import {
  FESTIVAL_TASK_APPROVED,
  FESTIVAL_TASK_READY_TO_REVIEW,
  FESTIVAL_TASK_REJECTED,
  FESTIVAL_TASK_IGNORED,
  FESTIVAL_TASK_READY_TO_ASSIGN,
} from "@overbookd/domain-events";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { READY_TO_ASSIGN_COLOR } from "~/utils/vuetify/theme/common";

const route = useRoute();
const ftStore = useFestivalTaskStore();
const userStore = useUserStore();
const configurationStore = useConfigurationStore();
const live = useLiveNotification();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const taskIdFromUrl = computed<number>(() => +route.params.id);
const name = computed<string>(() => selectedTask.value.general.name);
const headTitle = computed<string>(() => {
  const displayedName = name.value ? ` - ${name.value}` : "";
  return `FT ${taskIdFromUrl.value}${displayedName}`;
});

const calendarMarker = ref<Date>(configurationStore.eventStartDate);
const displayActivityEvents = ref<boolean>(false);
const displeyInquiryEvents = ref<boolean>(false);
const displayMobilizationEvents = ref<boolean>(true);

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

onMounted(async () => {
  await ftStore.fetchTask(taskIdFromUrl.value);
  if (selectedTask.value.id !== taskIdFromUrl.value) {
    navigateTo(FT_URL);
    return;
  }
  live.festivalTasks.listen(FESTIVAL_TASK_READY_TO_REVIEW, ({ data }) => {
    ftStore.updateSelectedTaskStatus(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_REJECTED, ({ data }) => {
    ftStore.updateSelectedTaskStatus(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_APPROVED, ({ data }) => {
    ftStore.updateSelectedTaskStatus(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_IGNORED, ({ data }) => {
    ftStore.updateSelectedTaskStatus(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_READY_TO_ASSIGN, ({ data }) => {
    ftStore.updateSelectedTaskStatus(data.festivalTask);
  });
});

onUnmounted(() => {
  live.festivalTasks.stopListening();
});

const isSideBarClosed = ref<boolean>(false);
const toggleSidebar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
};

const isValidatedOrReadyToAssign = computed<boolean>(() => {
  const isTaskValidated = isValidated(selectedTask.value);
  const isTaskReadyToAssign = isReadyToAssign(selectedTask.value);
  return isTaskValidated || isTaskReadyToAssign;
});
const canEnableAssignment = computed<boolean>(
  () => userStore.can(AFFECT_VOLUNTEER) && isValidatedOrReadyToAssign.value,
);
const cantStartAssignment = computed<boolean>(
  () => !isValidated(selectedTask.value),
);

const isEnableAssignmentOpen = ref<boolean>(false);
const openEnableAssignment = () => (isEnableAssignmentOpen.value = true);
const closeEnableAssignment = () => (isEnableAssignmentOpen.value = false);

const enableAssignment = async (categorize: Categorize) => {
  await ftStore.enableAssignment(categorize);
};

const publishFeedback = (content: string) => {
  ftStore.publishFeedback({ content });
};

const isCalendarDialogOpen = ref<boolean>(false);
const openCalendar = () => (isCalendarDialogOpen.value = true);
const closeCalendar = () => (isCalendarDialogOpen.value = false);

const filteredAllTimeWindowEvents = computed<CalendarEvent[]>(() => {
  return [
    ...filteredActivityEvents.value,
    ...filteredInquiryEvents.value,
    ...filteredMobilizationEvents.value,
  ];
});

const filteredActivityEvents = computed<CalendarEvent[]>(() => {
  return displayActivityEvents.value
    ? selectedTask.value.festivalActivity.timeWindows.map(({ start, end }) => {
        const event = {
          start,
          end,
          name: selectedTask.value.festivalActivity.name,
          color: "primary",
        };
        return createCalendarEvent(event);
      })
    : [];
});
const filteredInquiryEvents = computed<CalendarEvent[]>(() => {
  return displeyInquiryEvents.value
    ? selectedTask.value.festivalActivity.inquiry.timeWindows.map(
        ({ start, end }) => {
          const event = {
            start,
            end,
            name: "Matos",
            color: "secondary",
          };
          return createCalendarEvent(event);
        },
      )
    : [];
});
const filteredMobilizationEvents = computed<CalendarEvent[]>(() => {
  return displayMobilizationEvents.value
    ? selectedTask.value.mobilizations.map(({ start, end }) => {
        const event = {
          start,
          end,
          name: selectedTask.value.general.name,
          color: READY_TO_ASSIGN_COLOR,
        };
        return createCalendarEvent(event);
      })
    : [];
});
</script>

<style lang="scss" scoped>
$sidebar-margin: calc($card-margin * 2);
$side-nav-width: calc(350px + $sidebar-margin);

.task {
  display: flex;
  width: 100%;
}

.sidebar {
  position: sticky;
  top: 0;
  width: $side-nav-width;
  height: fit-content;
  max-height: calc(
    100vh - $header-height - 2 * $desktop-content-vertical-padding - 10px
  );
  flex-shrink: 0;
  z-index: 10;
}

.container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 20px;
  overflow-y: auto;
}

.container > * {
  flex-grow: 1;
}

#enable-assignment {
  color: whitesmoke;
  background-color: $ready-color;
  width: 100%;
  margin: 5px 0;
}

.v-switch {
  display: flex;
}

@media only screen and (max-width: $mobile-max-width) {
  .task {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }

  .sidebar {
    position: relative;
    width: 100%;
    margin: unset;
    margin-bottom: 20px;
  }

  .container {
    width: 100%;
    margin: unset;
    padding: unset;
  }
}
</style>

<template>
  <div>
    <div v-show="loading" class="loader">
      <v-progress-circular :size="120" :width="10" indeterminate />
    </div>

    <div v-show="!loading" class="ft task">
      <FestivalEventSidebar
        festival-event="FT"
        class="sidebar"
        @toggle="toggleSidebar"
      >
        <template #additional-actions>
          <v-btn
            v-if="canEnableAssignment"
            id="enable-assignment"
            aria-label="Commencer l'affectation"
            :title="isSideBarClosed ? `Commencer l'affectation` : ''"
            :disabled="cantStartAssignment"
            @click="openEnableAssignment"
          >
            <v-icon class="mr-2">mdi-human-greeting</v-icon>
            <p v-show="!isSideBarClosed">Commencer l'affectation</p>
          </v-btn>

          <div v-if="isReadyToAssign(selectedTask)" class="mt-2">
            <p>
              Catégorie de la tâche : <strong>{{ taskCategory }}</strong>
            </p>
            <p>
              Tâche prioritaire : <strong>{{ taskPriority }}</strong>
            </p>
          </div>
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
      <FtCalendarDialogCard @close="closeCalendar" />
    </v-dialog>

    <v-dialog v-model="isEnableAssignmentOpen" width="600">
      <CategorizeFormCard
        @close="closeEnableAssignment"
        @categorized="enableAssignment"
      />
    </v-dialog>
  </div>
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
import { AUCUNE } from "~/utils/assignment/task-category";

const route = useRoute();
const ftStore = useFestivalTaskStore();
const userStore = useUserStore();
const live = useLiveNotification();
const teamStore = useTeamStore();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const taskIdFromUrl = computed<number>(() => +route.params.id);
const name = computed<string>(() => selectedTask.value.general.name);
const headTitle = computed<string>(() => {
  const displayedName = name.value ? ` - ${name.value}` : "";
  return `FT ${taskIdFromUrl.value}${displayedName}`;
});

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

const loading = ref<boolean>(true);
onMounted(async () => {
  await ftStore.fetchTask(taskIdFromUrl.value);
  if (selectedTask.value.id !== taskIdFromUrl.value) return navigateTo(FT_URL);

  loading.value = false;

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

if (teamStore.ftReviewers.length === 0) teamStore.fetchFtReviewers();

const taskCategory = computed<string>(() => {
  if (!isReadyToAssign(selectedTask.value)) return "";
  return selectedTask.value.category ?? AUCUNE;
});
const taskPriority = computed<string>(() => {
  if (!isReadyToAssign(selectedTask.value)) return "";
  return selectedTask.value.topPriority ? "OUI" : "NON";
});

const isSideBarClosed = ref<boolean>(false);
const toggleSidebar = () => (isSideBarClosed.value = !isSideBarClosed.value);

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
</script>

<style lang="scss" scoped>
$sidebar-margin: calc($card-margin * 2);
$side-nav-width: calc(350px + $sidebar-margin);

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  opacity: 0.5;
}

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

@media screen and (max-width: $mobile-max-width) {
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

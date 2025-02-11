<template>
  <div class="task">
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
      <ParentFaCard id="fa" />
      <FtInquiryCard id="inquiry" :disabled="isValidatedOrReadyToAssign" />
      <InstructionsCard
        id="instructions"
        :disabled="isValidatedOrReadyToAssign"
      />
      <MobilizationCard
        id="mobilization"
        :disabled="isValidatedOrReadyToAssign"
      />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedTask"
        @publish="publishFeedback"
      />
    </article>
  </div>

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

const route = useRoute();
const ftStore = useFestivalTaskStore();
const userStore = useUserStore();
const live = useLiveNotification();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const taskIdFromUrl = computed<number>(() => +route.params.id);
const name = computed<string>(() => selectedTask.value.general.name);
const headTitle = computed<string>(() => {
  const displayedName = name.value ? ` - ${name.value}` : "";
  return `FT ${taskIdFromUrl.value}${displayedName}`;
});

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

onMounted(async () => {
  await ftStore.fetchTask(taskIdFromUrl.value);
  if (selectedTask.value.id !== taskIdFromUrl.value) {
    navigateTo(FT_URL);
    return;
  }
  live.festivalTasks.listen(FESTIVAL_TASK_READY_TO_REVIEW, ({ data }) => {
    ftStore.updateCurrentSelectedTask(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_REJECTED, ({ data }) => {
    ftStore.updateCurrentSelectedTask(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_APPROVED, ({ data }) => {
    ftStore.updateCurrentSelectedTask(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_IGNORED, ({ data }) => {
    ftStore.updateCurrentSelectedTask(data.festivalTask);
  });
  live.festivalTasks.listen(FESTIVAL_TASK_READY_TO_ASSIGN, ({ data }) => {
    ftStore.updateCurrentSelectedTask(data.festivalTask);
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

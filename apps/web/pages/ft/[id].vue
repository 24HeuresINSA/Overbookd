<template>
  <div class="task ft">
    <FestivalEventSidebar festival-event="FT" class="sidebar">
      <template #additional-actions>
        <v-btn
          v-if="canEnableAssignment"
          id="enable-assignment"
          text="Commencer l'affectation"
          :disabled="cantStartAssignment"
          @click="openEnableAssignment"
        />
      </template>
    </FestivalEventSidebar>
    <article class="container ft">
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

const route = useRoute();
const ftStore = useFestivalTaskStore();
const userStore = useUserStore();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const taskIdFromUrl = computed<number>(() => +route.params.id);
const name = computed<string>(() => selectedTask.value.general.name);
const headTitle = computed<string>(() => {
  const displayedName = name.value ? ` - ${name.value}` : "";
  return `FT ${taskIdFromUrl.value}${displayedName}`;
});

onMounted(async () => {
  await ftStore.fetchTask(taskIdFromUrl.value);
  if (selectedTask.value.id !== taskIdFromUrl.value) {
    navigateTo(FT_URL);
  }
});

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

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
  overflow: auto;
  scroll-behavior: smooth;
  gap: $card-gap;
}

.sidebar {
  position: fixed;
  width: $side-nav-width;
  height: fit-content;
}

.container {
  display: flex;
  flex-direction: column;
  width: calc(100% - $side-nav-width - $card-gap);
  margin-left: $side-nav-width + $card-gap;
  gap: $card-gap;
}

#enable-assignment {
  color: whitesmoke;
  background-color: $ready-color;
  width: 100%;
  margin: 5px 0;
}

@media only screen and (max-width: $mobile-max-width) {
  .activity {
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

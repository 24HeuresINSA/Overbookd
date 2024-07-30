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

const route = useRoute();
const router = useRouter();
const ftStore = useFestivalTaskStore();
const userStore = useUserStore();

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const taskIdFromUrl = computed<number>(() => +route.params.id);

onMounted(async () => {
  await ftStore.fetchTask(taskIdFromUrl.value);
  if (selectedTask.value.id !== taskIdFromUrl.value) {
    router.push({ path: "/ft" });
  }
});

useHead({
  title: `FT ${selectedTask.value.id} - ${selectedTask.value.general.name}`,
});

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
$sidebar-width: 350px;

.activity {
  display: flex;
  overflow: auto;
  scroll-behavior: smooth;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: calc(100vw - #{$sidebar-width} - 90px);
  padding: 12px;
  margin-left: $sidebar-width;
  gap: 20px;
}

#enable-assignment {
  color: whitesmoke;
  background-color: $ready-color;
  width: calc(100% - 25px);
  margin: 5px 10px 5px 15px;
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
    overflow: visible;
    margin: unset;
    padding: unset;
  }
}
</style>

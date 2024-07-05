<template>
  <div class="sidebar fa ft">
    <h1 id="title">{{ titleWithId }}</h1>
    <h2 id="name">{{ name }}</h2>

    <div id="status">
      <span id="dot" :class="status"></span>
      <h3>{{ statusLabel }}</h3>
    </div>

    <div class="icons">
      <div v-for="reviewer of reviewers" :key="reviewer.code" class="icon">
        <v-icon :class="getReviewerStatus(reviewer)" size="26">
          {{ reviewer.icon }}
        </v-icon>
        <span class="icon-detail">{{ reviewer.name }}</span>
      </div>
    </div>

    <v-btn
      id="ask-for-review"
      text="Demande de relecture"
      :disabled="!canAskForReview"
      @click="askForReview"
    />

    <slot name="additional-actions" />

    <FestivalEventSummary class="summary" :festival-event="festivalEvent" />
  </div>
</template>

<script lang="ts" setup>
import {
  type FestivalActivity,
  type FestivalEventIdentifier,
  type FestivalTaskWithConflicts as FestivalTask,
  isDraft,
  isRefused,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/http";
import {
  type FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import { getActivityReviewStatus } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  type FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import { BROUILLON } from "~/utils/festival-event/festival-event.model";
import { getTaskReviewStatus } from "~/utils/festival-event/festival-task/festival-task.utils";

const route = useRoute();
const faStore = useFestivalActivityStore();
const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();

const props = defineProps({
  festivalEvent: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FA",
  },
});
const isActivity = computed<boolean>(() => props.festivalEvent === "FA");

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);

const titleWithId = computed<string>(() => {
  const id = route.params.id;
  return isActivity.value ? `Fiche Activité n°${id}` : `Fiche Tâche n°${id}`;
});
const name = computed<string>(() =>
  isActivity.value
    ? selectedActivity.value.general.name
    : selectedTask.value.general.name,
);

const reviewers = computed<Team[]>(() =>
  isActivity.value ? teamStore.faReviewers : teamStore.ftReviewers,
);
if (reviewers.value.length === 0) {
  isActivity.value
    ? teamStore.fetchFaReviewers()
    : teamStore.fetchFtReviewers();
}

const statusLabel = computed<FaStatusLabel | FtStatusLabel>(() =>
  isActivity.value
    ? faStatusLabels.get(selectedActivity.value.status) ?? BROUILLON
    : ftStatusLabels.get(selectedTask.value.status) ?? BROUILLON,
);
const status = computed<string>(() =>
  isActivity.value
    ? selectedActivity.value.status.toLowerCase()
    : selectedTask.value.status.toLowerCase(),
);

const getReviewerStatus = (reviewer: Team): string => {
  const status = isActivity.value
    ? getActivityReviewStatus(selectedActivity.value, reviewer.code)
    : getTaskReviewStatus(selectedTask.value, reviewer.code);
  return status.toLowerCase();
};

const canAskForReview = computed<boolean>(() =>
  isActivity.value
    ? isDraft(selectedActivity.value) || isRefused(selectedActivity.value)
    : isDraft(selectedTask.value) || isRefused(selectedTask.value),
);
const askForReview = async () => {
  isActivity.value
    ? await faStore.askForReview()
    : await ftStore.askForReview();
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  padding-right: 20px;
  width: 350px;
  height: calc(100vh - #{$header-height} - #{$footer-height});
  overflow-y: auto;

  #ask-for-review {
    background-color: $submitted-color;
    margin-left: 16px;
  }

  #title {
    font-size: 1.7rem;
    margin: 16px;
    margin-bottom: 4px;
  }

  #name {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
    margin: 16px;
    margin-top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: auto;
    display: block;
  }

  #status {
    display: flex;
    align-items: center;

    #dot {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 16px;
      margin-right: 10px;
    }
  }

  .icons {
    display: flex;
    margin: 20px 5px 20px 16px;

    .icon {
      position: relative;
      display: inline-block;
      margin-right: 20px;

      .icon-detail {
        visibility: hidden;
        width: 60px;
        font-size: 0.9rem;
        text-align: center;
        border-radius: 6px;
        user-select: none;

        position: absolute;
        z-index: 1;
        top: 100%;
        left: 50%;
        margin-left: -30px;
      }
    }
  }

  .icon:hover .icon-detail {
    visibility: visible;
  }
}

@media only screen and (max-width: $mobile-max-width) {
  .sidebar {
    width: 100%;
    height: fit-content;
    overflow: visible;
    padding: unset;

    #ask-for-review {
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .summary {
    display: none;
  }
}
</style>

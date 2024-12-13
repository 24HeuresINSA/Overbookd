<template>
  <v-card class="sidebar fa ft">
    <v-card-title id="title">{{ titleWithId }}</v-card-title>
    <v-card-subtitle id="name">{{ name }}</v-card-subtitle>

    <v-card-text class="sidebar__text">
      <div id="status">
        <span id="dot" :class="status" />
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
        class="review-btn"
        text="Demande de relecture"
        :disabled="!canAskForReview"
        @click="askForReview"
      />

      <div v-for="team in myReviewers" :key="team.code" class="team-review">
        <v-btn
          :text="`Approuver pour ${team.name}`"
          class="approve review-btn"
          :disabled="cantApproveAs(team)"
          size="small"
          @click="approve(team)"
        />
        <v-btn
          :text="`Rejeter pour ${team.name}`"
          class="reject review-btn"
          :disabled="cantRejectAs(team)"
          size="small"
          @click="openRejectDialog(team)"
        />
        <v-btn
          v-if="canIgnore(team)"
          :text="`Ignorer pour ${team.name}`"
          class="ignore review-btn"
          size="small"
          @click="ignore(team)"
        />
      </div>

      <slot name="additional-actions" />

      <FestivalEventSummary class="summary" :festival-event="festivalEvent" />
    </v-card-text>

    <v-dialog v-model="isRejectDialogOpen" max-width="600">
      <AskRejectReasonDialogCard
        :identifier="festivalEvent"
        @reject="reject"
        @close="closeRejectDialog"
      />
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import {
  APPROVED,
  type FestivalActivity,
  type FestivalEventIdentifier,
  type FestivalTaskWithConflicts as FestivalTask,
  isActivityReviewer,
  isTaskReviewer,
  isDraft,
  isRefused,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  type Reviewer,
  elec,
  WILL_NOT_REVIEW,
  type ReviewStatus,
} from "@overbookd/festival-event";
import type { ReviewApproval, ReviewRejection } from "@overbookd/http";
import type { Team } from "@overbookd/team";
import {
  type FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import {
  getActivityReviewerStatus,
  hasReviewerAlreadyDoneHisActivityReview,
} from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  type FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import { BROUILLON } from "~/utils/festival-event/festival-event.constant";
import {
  getTaskReviewerStatus,
  hasReviewerAlreadyDoneHisTaskReview,
} from "~/utils/festival-event/festival-task/festival-task.utils";

const route = useRoute();
const faStore = useFestivalActivityStore();
const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

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
const myActivityReviewers = computed<Team[]>(() => {
  const activity = selectedActivity.value;
  if (isDraft(activity)) return [];

  return reviewers.value.filter(({ code }) => {
    if (!isActivityReviewer(code)) return false;
    const isReviewer = userStore.isMemberOf(code);
    const shouldReview = activity.reviews[`${code}`] !== NOT_ASKING_TO_REVIEW;
    return isReviewer && shouldReview;
  });
});
const myTaskReviewers = computed<Team[]>(() => {
  const task = selectedTask.value;
  if (isDraft(task)) return [];

  return reviewers.value.filter(({ code }) => {
    if (!isTaskReviewer(code)) return false;
    const isReviewer = userStore.isMemberOf(code);
    const shouldReview = isConcerned(task.reviews[`${code}`]);
    return isReviewer && shouldReview;
  });
});
const myReviewers = computed<Team[]>(() =>
  isActivity.value ? myActivityReviewers.value : myTaskReviewers.value,
);

const statusLabel = computed<FaStatusLabel | FtStatusLabel>(() =>
  isActivity.value
    ? (faStatusLabels.get(selectedActivity.value.status) ?? BROUILLON)
    : (ftStatusLabels.get(selectedTask.value.status) ?? BROUILLON),
);
const status = computed<string>(() =>
  isActivity.value
    ? selectedActivity.value.status.toLowerCase()
    : selectedTask.value.status.toLowerCase(),
);

const getReviewerStatus = (reviewer: Team): string => {
  const status = isActivity.value
    ? getActivityReviewerStatus(selectedActivity.value, reviewer.code)
    : getTaskReviewerStatus(selectedTask.value, reviewer.code);
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

const isRejectDialogOpen = ref<boolean>(false);
const rejecter = ref<Reviewer<"FA"> | Reviewer<"FT"> | null>(null);

const openRejectDialog = (team: Team) => {
  rejecter.value = team.code as Reviewer<"FA"> | Reviewer<"FT">;
  isRejectDialogOpen.value = true;
};
const closeRejectDialog = () => (isRejectDialogOpen.value = false);

const reject = (reason: string) => {
  if (!rejecter.value) return;
  const form = { reason, team: rejecter.value };
  isActivity.value
    ? faStore.rejectBecause(form)
    : ftStore.rejectBecause(form as ReviewRejection<"FT">);
  closeRejectDialog();
};
const approve = (team: Team) => {
  const form = { team: team.code };
  isActivity.value
    ? faStore.approve(form as ReviewApproval<"FA">)
    : ftStore.approve(form as ReviewApproval<"FT">);
};
const ignore = (team: Team) => {
  if (isActivity.value) return;
  ftStore.ignore({ team: team.code });
};

const cantApproveAs = (team: Team): boolean => {
  const isAlreadyApprovedBy = isActivity.value
    ? hasReviewerAlreadyDoneHisActivityReview(
        selectedActivity.value,
        team.code as Reviewer<"FA">,
        APPROVED,
      )
    : hasReviewerAlreadyDoneHisTaskReview(
        selectedTask.value,
        team.code as Reviewer<"FT">,
        APPROVED,
      );
  const isTeamMember = userStore.isMemberOf(team.code);
  return isAlreadyApprovedBy || !isTeamMember;
};
const cantRejectAs = (team: Team): boolean => {
  const isAlreadyRejectedBy = isActivity.value
    ? hasReviewerAlreadyDoneHisActivityReview(
        selectedActivity.value,
        team.code as Reviewer<"FA">,
        REJECTED,
      )
    : hasReviewerAlreadyDoneHisTaskReview(
        selectedTask.value,
        team.code as Reviewer<"FT">,
        REJECTED,
      );

  const isTeamMember = userStore.isMemberOf(team.code);
  return isAlreadyRejectedBy || !isTeamMember;
};
const canIgnore = (team: Team): boolean => {
  if (isActivity.value || team.code !== elec || isDraft(selectedTask.value)) {
    return false;
  }
  return isConcerned(selectedTask.value.reviews.elec);
};

const isConcerned = (review: ReviewStatus<"FT">): boolean => {
  return review !== NOT_ASKING_TO_REVIEW && review !== WILL_NOT_REVIEW;
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 350px;

  &__text {
    overflow-y: auto;
  }

  #title {
    font-size: 1.6rem;
    font-weight: bold;
    padding-bottom: 0;
  }

  #name {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
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
      margin-right: 10px;
    }
  }

  .icons {
    display: flex;
    margin: 20px 0 20px 0;

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

  #ask-for-review {
    background-color: $submitted-color;
    margin-bottom: 5px;
  }

  .review-btn {
    width: 100%;
  }

  .team-review {
    .reject,
    .approve,
    .ignore {
      color: whitesmoke;
      font-weight: bolder;
      margin-bottom: 5px;
    }
    .reject {
      background-color: $refused-color;
    }
    .approve {
      background-color: $validated-color;
      margin-top: 5px;
    }
    .ignore {
      background-color: $draft-color;
    }
  }
}

@media only screen and (max-width: $mobile-max-width) {
  .sidebar {
    width: 100%;
    height: fit-content;
    overflow: visible;
    padding: unset;

    .team-review {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .review-btn {
      margin-left: auto;
      margin-right: auto;
    }
  }

  .summary {
    display: none;
  }
}
</style>

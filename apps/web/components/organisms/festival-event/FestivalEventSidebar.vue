<template>
  <v-card class="sidebar fa ft" :class="{ closed: isSideBarClosed }">
    <v-card-title id="title">{{ titleWithId }}</v-card-title>
    <v-container class="name-container status">
      <span id="name">{{ name }}</span>
      <span
        v-show="isSideBarClosed"
        class="dot mini-dot"
        :class="status"
        :aria-label="statusLabel"
        :title="statusLabel"
      />
    </v-container>
    <v-btn
      v-if="!isMobile"
      icon="mdi-chevron-left"
      :aria-label="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la barre latérale`"
      :title="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la barre latérale`"
      variant="flat"
      density="compact"
      class="btn-close-side-bar"
      :class="{ 'rotate-180': isSideBarClosed }"
      @click="toggleSideBar"
    />
    <v-card-text class="sidebar__text">
      <div v-show="!isSideBarClosed" id="status">
        <span class="dot" :class="status" />
        <h3>{{ statusLabel }}</h3>
      </div>

      <div :class="['icons', { 'flex-column': isSideBarClosed }]">
        <div
          v-for="reviewer of reviewers"
          :key="reviewer.code"
          class="icon"
          :class="{ closed: isSideBarClosed }"
        >
          <v-icon
            :class="getReviewerStatus(reviewer).toLowerCase()"
            :icon="reviewer.icon"
            size="26"
            :aria-label="getReviewerTitle(reviewer)"
            :title="getReviewerTitle(reviewer)"
          />
          <span class="icon-detail">{{ reviewer.name }}</span>
        </div>
      </div>

      <v-btn
        id="ask-for-review"
        class="review-btn"
        aria-label="Demande de relecture"
        :title="isSideBarClosed ? 'Demande de relecture' : ''"
        :disabled="!canAskForReview"
        @click="askForReview"
      >
        <v-icon class="mr-2">mdi-rocket-launch-outline</v-icon>
        <p v-show="!isSideBarClosed">Demande de relecture</p>
      </v-btn>
      <div v-show="!isSideBarClosed">
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
            @click="ignore(team.code)"
          />
        </div>
      </div>

      <slot name="additional-actions" />

      <FestivalEventSummary
        v-show="!isSideBarClosed"
        class="summary"
        :festival-event="festivalEvent"
      />
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
  type FestivalActivity,
  type FestivalEventIdentifier,
  type FestivalTaskWithConflicts as FestivalTask,
  canIgnoreFestivalTaskAs,
  isActivityReviewer,
  isTaskReviewer,
  isDraft,
  isRefused,
  type Reviewer,
  type ReviewStatus,
} from "@overbookd/festival-event";
import type { ReviewApproval, ReviewRejection } from "@overbookd/http";
import type { Team } from "@overbookd/team";
import {
  APPROVED,
  BROUILLON,
  NOT_ASKING_TO_REVIEW,
  PAS_DE_RELECTURE,
  REJECTED,
  reviewLabels,
  statusLabels,
  WILL_NOT_REVIEW,
  type Review,
  type StatusLabel,
} from "@overbookd/festival-event-constants";
import {
  getActivityReviewerStatus,
  hasReviewerAlreadyDoneHisActivityReview,
} from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  getTaskReviewerStatus,
  hasReviewerAlreadyDoneHisTaskReview,
} from "~/utils/festival-event/festival-task/festival-task.utils";

const route = useRoute();
const faStore = useFestivalActivityStore();
const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();

const isMobile = computed<boolean>(() => layoutStore.isMobile);
const isSideBarClosed = ref<boolean>(false);

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

const emit = defineEmits(["toggle"]);
const toggleSideBar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
  emit("toggle");
};

const eventId = computed<number>(() => +route.params.id);
const titleWithId = computed<string>(() => {
  const id = eventId.value;
  if (isSideBarClosed.value) {
    return isActivity.value ? `FA n°${id}` : `FT n°${id}`;
  }
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

const statusLabel = computed<StatusLabel>(() => {
  const status = isActivity.value
    ? selectedActivity.value.status
    : selectedTask.value.status;
  return statusLabels.get(status) ?? BROUILLON;
});
const status = computed<string>(() =>
  isActivity.value
    ? selectedActivity.value.status.toLowerCase()
    : selectedTask.value.status.toLowerCase(),
);

const getReviewerStatus = (reviewer: Team): Review => {
  const status = isActivity.value
    ? getActivityReviewerStatus(selectedActivity.value, reviewer.code)
    : getTaskReviewerStatus(selectedTask.value, reviewer.code);
  return status;
};

const getReviewerTitle = (reviewer: Team): string =>
  reviewLabels.get(getReviewerStatus(reviewer)) ?? PAS_DE_RELECTURE;

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
const ignore = (team: string) => {
  if (isActivity.value || !isTaskReviewer(team)) return;
  ftStore.ignore({ team });
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
  if (isActivity.value || !isTaskReviewer(team.code)) return false;
  const cantIgnoreAs = !canIgnoreFestivalTaskAs(team.code);
  if (cantIgnoreAs || isDraft(selectedTask.value)) return false;
  return isConcerned(selectedTask.value.reviews[`${team.code}`]);
};

const isConcerned = (review: ReviewStatus<"FT">): boolean => {
  return review !== NOT_ASKING_TO_REVIEW && review !== WILL_NOT_REVIEW;
};
</script>

<style lang="scss" scoped>
.btn-close-side-bar {
  position: absolute;
  top: 10px;
  right: 10px;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 350px;
  transition: width 0.3s ease;
  overflow-x: hidden;

  &__text {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &.closed {
    width: 140px;
  }

  #title {
    font-size: 1.6rem;
    font-weight: bold;
    padding-bottom: 0;
  }

  .name-container {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 4px;

    #name {
      font-size: 1.2rem;
      font-weight: normal;
      opacity: 0.7;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: fit-content;
    }
  }

  #status {
    display: flex;
    align-items: center;
  }

  .dot {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    display: inline-block;
    margin-left: 5px;
    margin-right: 10px;
  }
  .mini-dot {
    height: 15px;
    width: 15px;
    flex-shrink: 0;
  }

  .icons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 25px 0;
    height: 300;

    .icon {
      position: relative;
      display: inline-block;

      .icon-detail {
        visibility: hidden;
        width: 100px;
        font-size: 0.9rem;
        text-align: center;
        border-radius: 6px;
        user-select: none;

        position: absolute;
        z-index: 1;
        top: 100%;
        left: 50%;
        margin-left: -50px;
      }

      &.closed {
        margin-bottom: 15px;
      }
    }
  }

  .icon:hover .icon-detail {
    visibility: visible;
  }

  #ask-for-review {
    background-color: $in-review-color;
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

@media screen and (max-width: $mobile-max-width) {
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

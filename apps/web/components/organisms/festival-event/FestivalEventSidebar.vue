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
      :disabled="!canAskForReview"
      @click="askForReview"
    >
      Demande de relecture
    </v-btn>

    <slot name="additional-actions" />

    <FestivalEventSummary class="summary" :festival-event="festivalEvent" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FestivalEventSummary from "./FestivalEventSummary.vue";
import { getActivityReviewStatus } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import { Team } from "@overbookd/http";
import {
  FestivalActivity,
  FestivalTaskWithConflicts as FestivalTask,
  isDraft,
  isRefused,
} from "@overbookd/festival-event";
import {
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import { BROUILLON } from "~/utils/festival-event/festival-event.model";
import { getTaskReviewStatus } from "~/utils/festival-event/festival-task/festival-task.utils";

export default Vue.extend({
  name: "FestivalEventSidebar",
  components: { FestivalEventSummary },
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  computed: {
    selectedActivity(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    isActivity(): boolean {
      return this.festivalEvent === "FA";
    },
    titleWithId(): string {
      return this.isActivity
        ? `Fiche Activité n°${this.$route.params.faId}`
        : `Fiche Tâche n°${this.$route.params.ftId}`;
    },
    name(): string {
      return this.isActivity
        ? this.selectedActivity.general.name
        : this.selectedTask.general.name;
    },
    statusLabel(): FaStatusLabel | FtStatusLabel {
      return this.isActivity
        ? faStatusLabels.get(this.selectedActivity.status) ?? BROUILLON
        : ftStatusLabels.get(this.selectedTask.status) ?? BROUILLON;
    },
    reviewers(): Team[] {
      return this.isActivity
        ? this.$accessor.team.faValidators
        : this.$accessor.team.ftValidators;
    },
    status(): string {
      return this.isActivity
        ? this.selectedActivity.status.toLowerCase()
        : this.selectedTask.status.toLowerCase();
    },
    canAskForReview(): boolean {
      return this.isActivity
        ? isDraft(this.selectedActivity) || isRefused(this.selectedActivity)
        : isDraft(this.selectedTask) || isRefused(this.selectedTask);
    },
  },
  mounted() {
    if (this.reviewers.length > 0) return;
    this.isActivity
      ? this.$accessor.team.fetchFaValidators()
      : this.$accessor.team.fetchFtValidators();
  },
  methods: {
    getReviewerStatus(reviewer: Team): string {
      return this.isActivity
        ? getActivityReviewStatus(
            this.selectedActivity,
            reviewer.code,
          ).toLowerCase()
        : getTaskReviewStatus(this.selectedTask, reviewer.code).toLowerCase();
    },
    async askForReview() {
      if (this.isActivity) {
        return this.$accessor.festivalActivity.askForReview();
      }
      await this.$accessor.festivalTask.askForReview();
    },
  },
});
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

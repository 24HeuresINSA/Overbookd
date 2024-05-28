<template>
  <div class="ft-content ft">
    <FestivalEventSidebar festival-event="FT" class="sidebar">
      <template #additional-actions>
        <div class="reviews">
          <div v-for="team in reviewers" :key="team" class="team-review">
            <v-btn
              :id="`${team}-approve`"
              class="approve"
              :disabled="!canApproveAs(team)"
              @click="approved(team)"
            >
              Approuver pour {{ team }}
            </v-btn>
            <v-btn
              :id="`${team}-reject`"
              class="reject"
              :disabled="!canRejectAs(team)"
              @click="askReject(team)"
            >
              Rejeter pour {{ team }}
            </v-btn>
          </div>
          <v-btn
            v-if="canEnableAssignment"
            id="enable-assignment"
            :disabled="cannotStartAssignment"
            @click="openEnableAssignment"
          >
            Commencer l'affectation
          </v-btn>
        </div>

        <div v-show="isReadyToAssign" class="categorize">
          <p>
            Catégorie de la tâche : <strong>{{ taskCategory }}</strong>
          </p>
          <p>
            Tâche prioritaire : <strong>{{ taskPriority }}</strong>
          </p>
        </div>
      </template>
    </FestivalEventSidebar>
    <v-container class="container ft">
      <FtGeneralCard id="general" :disabled="!canUpdate" />
      <ParentFaCard id="fa" @open:calendar="openCalendar" />
      <FtInquiryCard id="inquiry" :disabled="!canUpdate" />
      <InstructionsCard id="instructions" :disabled="!canUpdate" />
      <MobilizationCard
        id="mobilization"
        :disabled="!canUpdate"
        @open:calendar="openCalendar"
      />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedTask"
        @publish="publishFeedback"
      />

      <v-dialog v-model="isRejectDialogOpen" max-width="600">
        <AskRejectReasonFormCard
          identifier="FT"
          @close-dialog="closeRejectDialog"
          @rejected="rejected"
        />
      </v-dialog>
    </v-container>
    <v-dialog v-model="isCalendarDialogOpen" max-width="1000">
      <FestivalTaskCalendar :task="selectedTask" />
    </v-dialog>
    <v-dialog v-model="isEnableAssignmentOpen" width="600">
      <CategorizeFormCard
        @close-dialog="closeEnableAssignment"
        @categorized="enableAssignment"
      />
    </v-dialog>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  APPROVED,
  FestivalTask,
  REJECTED,
  ReviewStatus,
  Reviewer,
  elec,
  humain,
  isDraft,
  matos,
  Categorize,
  isValidated,
  isReadyToAssign,
} from "@overbookd/festival-event";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import FtGeneralCard from "~/components/organisms/festival-event/festival-task/FtGeneralCard.vue";
import InstructionsCard from "~/components/organisms/festival-event/festival-task/InstructionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FtInquiryCard from "~/components/organisms/festival-event/festival-task/FtInquiryCard.vue";
import ParentFaCard from "~/components/organisms/festival-event/festival-task/ParentFaCard.vue";
import MobilizationCard from "~/components/organisms/festival-event/festival-task/MobilizationCard.vue";
import FeedbackCard from "~/components/organisms/festival-event/FeedbackCard.vue";
import AskRejectReasonFormCard from "~/components/molecules/festival-event/review/AskRejectReasonFormCard.vue";
import CategorizeFormCard from "~/components/molecules/festival-event/review/CategorizeFormCard.vue";
import { AUCUNE } from "~/utils/assignment/task-category";
import FestivalTaskCalendar from "~/components/molecules/festival-event/FestivalTaskCalendar.vue";

type FestivalTaskDetailsData = {
  isRejectDialogOpen: boolean;
  reviewer?: Reviewer<"FT">;
  isCalendarDialogOpen: boolean;
  isEnableAssignmentOpen: boolean;
};

export default defineComponent({
  components: {
    FestivalEventSidebar,
    SnackNotificationContainer,
    FtGeneralCard,
    InstructionsCard,
    FtInquiryCard,
    ParentFaCard,
    MobilizationCard,
    FeedbackCard,
    AskRejectReasonFormCard,
    CategorizeFormCard,
    FestivalTaskCalendar,
  },
  data: (): FestivalTaskDetailsData => ({
    isRejectDialogOpen: false,
    isCalendarDialogOpen: false,
    isEnableAssignmentOpen: false,
  }),
  computed: {
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    ftId(): number {
      return +this.$route.params.ftId;
    },
    canUpdate(): boolean {
      const isValidatedOrReadyToAssign =
        isReadyToAssign(this.selectedTask) || isValidated(this.selectedTask);
      return !isValidatedOrReadyToAssign;
    },
    reviewers(): Reviewer<"FT">[] {
      const potentialReviewer: Reviewer<"FT">[] = this.selectedTask
        .festivalActivity.hasSupplyRequest
        ? [humain, matos, elec]
        : [humain, matos];

      return potentialReviewer.filter((team) =>
        this.$accessor.user.isMemberOf(team),
      );
    },
    canEnableAssignment(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    cannotStartAssignment(): boolean {
      return !isValidated(this.selectedTask);
    },
    isReadyToAssign(): boolean {
      return isReadyToAssign(this.selectedTask);
    },
    taskCategory(): string {
      if (!isReadyToAssign(this.selectedTask)) return "";
      return this.selectedTask.category ?? AUCUNE;
    },
    taskPriority(): string {
      if (!isReadyToAssign(this.selectedTask)) return "";
      return this.selectedTask.topPriority ? "OUI" : "NON";
    },
  },
  async mounted() {
    await this.$accessor.festivalTask.fetchTask(this.ftId);
    if (this.selectedTask.id !== this.ftId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FT n'existe pas...",
      });
      this.$router.push({ path: "/ft" });
    }
    document.title = `FT ${this.ftId} - ${this.selectedTask.general.name}`;
  },
  methods: {
    publishFeedback(content: string) {
      this.$accessor.festivalTask.publishFeedback({ content });
    },
    canRejectAs(team: Reviewer<"FT">): boolean {
      const isAlreadyRejectedBy = this.hasReviewerAlreadyDoneHisReview(
        this.selectedTask,
        team,
        REJECTED,
      );
      const isTeamMember = this.$accessor.user.isMemberOf(team);
      return !isAlreadyRejectedBy && isTeamMember;
    },
    canApproveAs(team: Reviewer<"FT">): boolean {
      const isAlreadyApprovedBy = this.hasReviewerAlreadyDoneHisReview(
        this.selectedTask,
        team,
        APPROVED,
      );
      const isTeamMember = this.$accessor.user.isMemberOf(team);
      return !isAlreadyApprovedBy && isTeamMember;
    },
    hasReviewerAlreadyDoneHisReview(
      task: FestivalTask,
      reviewer: Reviewer<"FT">,
      status: ReviewStatus,
    ) {
      if (isDraft(task)) return true;
      switch (reviewer) {
        case humain:
          return task.reviews.humain === status;
        case matos:
          return task.reviews.matos === status;
        case elec:
          return task.reviews.elec === status;
      }
    },
    askReject(team: Reviewer<"FT">) {
      this.reviewer = team;
      this.isRejectDialogOpen = true;
    },
    closeRejectDialog() {
      this.isRejectDialogOpen = false;
    },
    openCalendar() {
      this.isCalendarDialogOpen = true;
    },
    rejected({ reason }: { reason: string }) {
      const team = this.reviewer;
      if (!team) return;
      this.$accessor.festivalTask.rejectBecause({ team, reason });
    },
    approved(team: Reviewer<"FT">) {
      this.$accessor.festivalTask.approve({ team });
    },
    openEnableAssignment() {
      this.isEnableAssignmentOpen = true;
    },
    closeEnableAssignment() {
      this.isEnableAssignmentOpen = false;
    },
    enableAssignment(categorize: Categorize) {
      this.$accessor.festivalTask.enableAssignment(categorize);
    },
  },
});
</script>

<style lang="scss" scoped>
$sidebar-width: 350px;

.ft-content {
  display: flex;
  height: calc(100vh - #{$header-height} - #{$footer-height});
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

.reviews {
  margin: 10px 0px 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  #enable-assignment {
    color: whitesmoke;
    font-weight: bolder;
    min-width: 100%;
    background-color: $ready-color;
  }
}

.categorize {
  margin-left: 16px;
  p {
    margin: 0;
  }
}

.team-review {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .reject,
  .approve {
    color: whitesmoke;
    font-weight: bolder;
    min-width: 100%;
  }
  .reject {
    background-color: $refused-color;
  }
  .approve {
    background-color: $validated-color;
  }
}
.filters {
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  background-color: white;
}

@media only screen and (max-width: $mobile-max-width) {
  .ft-content {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }

  .filters {
    flex-direction: column;
    align-items: center;
    .v-btn {
      width: 90%;
    }
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

  .reviews {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

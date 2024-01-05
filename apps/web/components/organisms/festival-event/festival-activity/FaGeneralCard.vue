<template>
  <div>
    <v-card>
      <div v-if="canReviewGeneralSection" class="review">
        <v-btn
          class="review__action"
          fab
          x-small
          color="success"
          :disabled="cantApproveGeneralSection"
          @click="approveGeneralSection"
        >
          <v-icon>mdi-check-circle-outline</v-icon>
        </v-btn>
        <v-btn
          class="review__action"
          fab
          x-small
          color="error"
          :disabled="cantRejectGeneralSection"
          @click="rejectGeneralSection"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </div>

      <v-card-title>Général</v-card-title>

      <v-card-subtitle>
        <p>
          N'hésite pas si tu as des questions à contacter
          <a :href="`mailto:${contact}`">
            {{ contact }}
          </a>
          .
        </p>
        <p>
          Tu peux aussi t'aider en allant voir les FA de l'année dernière sur
          <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a>
          en te connectant avec jeuneetcon@24heures.org.
        </p>
      </v-card-subtitle>

      <v-card-text>
        <v-text-field
          :value="general.name"
          label="Nom de l'activité"
          @change="updateName"
        />

        <v-switch
          :value="general.toPublish"
          label="Publier sur le site / plaquette"
          @change="updateToPublishOrAskPublicData"
        />

        <v-label>Description</v-label>
        <RichEditor
          :data="general.description ?? ''"
          label="Description"
          class="mb-6"
          @change="updateDescription"
        />

        <v-combobox
          :value="general.categories"
          chips
          multiple
          clearable
          dense
          label="Catégories de l'activité"
          :items="categories"
          @change="updateCategories"
        />

        <v-text-field
          v-show="general.toPublish"
          :value="general.photoLink"
          label="Lien de la photo de l'activité sur le drive"
          @change="updatePhotoLink"
        />

        <v-switch
          v-show="general.toPublish"
          :input-value="general.isFlagship"
          label="Activité phare qui sera mise en avant sur les réseaux sociaux"
          @change="updateIsFlagship"
        />

        <v-card class="time-window-table">
          <div v-if="canReviewTimeWindows" class="review">
            <v-btn
              class="review__action"
              fab
              x-small
              color="success"
              :disabled="cantApproveTimeWindows"
              @click="approveTimeWindows"
            >
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn
              class="review__action"
              fab
              x-small
              color="error"
              :disabled="cantRejectTimeWindows"
              @click="rejectTimeWindows"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
          <v-card-title class="time-window-table__title">
            Créneaux de l'activité
            <v-btn
              fab
              dark
              small
              color="primary"
              class="time-window-table__title-icon"
              @click="openCalendar"
            >
              <v-icon dark> mdi-calendar-blank </v-icon>
            </v-btn>
          </v-card-title>
          <FaTimeWindowTable
            :time-windows="general.timeWindows"
            @add="addTimeWindow"
            @remove="removeTimeWindow"
          />
        </v-card>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isAskPublicDataDialogOpen" max-width="600">
      <AskPublicDataFormCard @close-dialog="closeAskPublicDataDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  APPROVED,
  FestivalActivity,
  REJECTED,
  ReviewStatus,
  TimeWindow,
  communication,
  humain,
  isDraft,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import AskPublicDataFormCard from "~/components/molecules/festival-event/public-activity/AskPublicDataFormCard.vue";
import { activityCategories } from "~/utils/festival-event/festival-activity.model";

const comcomEmail = "communication@24heures.org";
const humainEmail = "humain@24heures.org";

type GeneralReviewer = typeof communication | typeof humain;

type FaGeneralCardData = {
  isAskPublicDataDialogOpen: boolean;
};

export default defineComponent({
  name: "FaGeneralCard",
  components: {
    RichEditor,
    FaTimeWindowTable,
    AskPublicDataFormCard,
  },
  emits: ["reject", "open:calendar"],
  data: (): FaGeneralCardData => ({
    isAskPublicDataDialogOpen: false,
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    general(): FestivalActivity["general"] {
      return this.mFA.general;
    },
    categories(): string[] {
      return activityCategories;
    },
    isPublic(): boolean {
      return this.general.toPublish === true;
    },
    contact(): string {
      return this.isPublic ? comcomEmail : humainEmail;
    },
    generalReviewer(): GeneralReviewer {
      return this.isPublic ? communication : humain;
    },
    canReviewGeneralSection(): boolean {
      return this.$accessor.user.isMemberOf(this.generalReviewer);
    },
    canReviewTimeWindows(): boolean {
      return this.$accessor.user.isMemberOf(humain);
    },
    cantApproveGeneralSection(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(
        this.mFA,
        this.generalReviewer,
        APPROVED,
      );
    },
    cantRejectGeneralSection(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(
        this.mFA,
        this.generalReviewer,
        REJECTED,
      );
    },
    cantApproveTimeWindows(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(this.mFA, humain, APPROVED);
    },
    cantRejectTimeWindows(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(this.mFA, humain, REJECTED);
    },
  },
  methods: {
    updateName(name: string) {
      this.$accessor.festivalActivity.updateGeneral({ name });
    },
    updateToPublishOrAskPublicData(canBeNull: boolean) {
      const toPublish = canBeNull === true;

      if (toPublish === true && !isDraft(this.mFA)) {
        this.isAskPublicDataDialogOpen = true;
        return;
      }

      this.$accessor.festivalActivity.updateGeneral({ toPublish });
    },
    closeAskPublicDataDialog() {
      this.isAskPublicDataDialogOpen = false;
    },
    updateDescription(canBeEmpty: string) {
      const description = canBeEmpty.trim() ? canBeEmpty : null;
      this.$accessor.festivalActivity.updateGeneral({ description });
    },
    updatePhotoLink(canBeEmpty: string) {
      const photoLink = canBeEmpty.trim() ? canBeEmpty : null;
      this.$accessor.festivalActivity.updateGeneral({ photoLink });
    },
    updateCategories(categories: string[]) {
      this.$accessor.festivalActivity.updateGeneral({ categories });
    },
    updateIsFlagship(isFlagship: boolean) {
      this.$accessor.festivalActivity.updateGeneral({ isFlagship });
    },
    addTimeWindow(period: IProvidePeriod) {
      this.$accessor.festivalActivity.addGeneralTimeWindow(period);
    },
    removeTimeWindow(timeWindow: TimeWindow) {
      this.$accessor.festivalActivity.removeGeneralTimeWindow(timeWindow.id);
    },
    approveGeneralSection() {
      this.$accessor.festivalActivity.approveAs(this.generalReviewer);
    },
    rejectGeneralSection() {
      this.$emit("reject", this.generalReviewer);
    },
    approveTimeWindows() {
      this.$accessor.festivalActivity.approveAs(humain);
    },
    rejectTimeWindows() {
      this.$emit("reject", humain);
    },
    hasReviewerAlreadyDoneHisReview(
      fa: FestivalActivity,
      reviewer: GeneralReviewer,
      status: ReviewStatus,
    ) {
      if (isDraft(fa)) return true;
      switch (reviewer) {
        case humain:
          return fa.reviews.humain === status;
        case communication:
          return fa.reviews.communication === status;
        default:
          return true;
      }
    },
    openCalendar() {
      this.$emit("open:calendar");
    },
  },
});
</script>

<style lang="scss" scoped>
.review {
  position: relative;
  height: 0;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-start;
}

.time-window-table {
  margin: 15px 0 30px 0;
  padding: 5px;
  &__title {
    font-size: 1.1rem;
  }
  &__title-icon {
    margin-left: 10px;
  }
}
</style>

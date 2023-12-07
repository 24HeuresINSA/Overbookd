<template>
  <div>
    <v-card>
      <div v-if="canReview" class="review">
        <v-btn
          class="review__action"
          fab
          x-small
          color="success"
          :disabled="cantApprove"
          @click="approved"
        >
          <v-icon>mdi-check-circle-outline</v-icon>
        </v-btn>
        <v-btn
          class="review__action"
          fab
          x-small
          color="error"
          :disabled="cantReject"
          @click="rejected"
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
          @change="tryToUpdateToPublish"
        />

        <v-label>Description</v-label>
        <RichEditor
          :data="general.description ?? ''"
          label="Description"
          class="mb-4"
          @change="updateDescription"
        />

        <section class="time-windows">
          <h2>Créneaux de l'activité</h2>
          <FaTimeWindowTable
            :time-windows="general.timeWindows"
            @add="addTimeWindow"
            @remove="removeTimeWindow"
          />
        </section>

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
      </v-card-text>
    </v-card>

    <v-dialog v-model="isPublishActivityDialogOpen" max-width="600">
      <PublishActivityFormCard @close-dialog="closePublishActivityDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import PublishActivityFormCard from "~/components/molecules/festival-event/public-activity/PublishActivityFormCard.vue";
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
import { activityCategories } from "~/utils/festival-event/festival-activity.model";
import { IProvidePeriod } from "@overbookd/period";

const comcomEmail = "communication@24heures.org";
const humainEmail = "humain@24heures.org";

type GeneralReviewer = typeof communication | typeof humain;

type FaGeneralCardDate = {
  isPublishActivityDialogOpen: boolean;
};

export default defineComponent({
  name: "FaGeneralCard",
  components: { RichEditor, FaTimeWindowTable, PublishActivityFormCard },
  data: (): FaGeneralCardDate => ({
    isPublishActivityDialogOpen: false,
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
    reviewer(): GeneralReviewer {
      return this.isPublic ? communication : humain;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(this.reviewer);
    },
    cantApprove(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(
        this.mFA,
        this.reviewer,
        APPROVED,
      );
    },
    cantReject(): boolean {
      return this.hasReviewerAlreadyDoneHisReview(
        this.mFA,
        this.reviewer,
        REJECTED,
      );
    },
  },
  methods: {
    updateName(name: string) {
      this.$accessor.festivalActivity.updateGeneral({ name });
    },
    tryToUpdateToPublish(canBeNull: boolean) {
      const toPublish = canBeNull === true;

      if (toPublish === true && !isDraft(this.mFA)) {
        this.isPublishActivityDialogOpen = true;
        return;
      }

      this.$accessor.festivalActivity.updateGeneral({ toPublish });
    },
    closePublishActivityDialog() {
      this.isPublishActivityDialogOpen = false;
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
    approved() {
      this.$accessor.festivalActivity.approveAs(this.reviewer);
    },
    rejected() {
      const reason = "Section generale non valide";
      const rejection = { team: this.reviewer, reason };
      this.$accessor.festivalActivity.rejectBecause(rejection);
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
  },
});
</script>

<style lang="scss" scoped>
.review {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>

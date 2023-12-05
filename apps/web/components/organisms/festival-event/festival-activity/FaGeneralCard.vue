<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn
        class="review__action"
        fab
        x-small
        color="success"
        @click="approved"
        :disabled="cantApprove"
      >
        <v-icon>mdi-check-circle-outline</v-icon>
      </v-btn>
      <v-btn class="review__action" fab x-small color="error">
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
        @change="updateToPublish"
      />

      <v-label>Description</v-label>
      <RichEditor
        :data="general.description ?? ''"
        label="Description"
        class="mb-4"
        @change="updateDescription"
      />

      <section class="time-windows">
        <h2>Créneaux de l'animation</h2>
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
        label="Categories de l'animations"
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
        label="Animation phare qui sera mise en avant sur les réseaux sociaux"
        @change="updateIsFlagship"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import {
  APPROVED,
  FestivalActivity,
  Reviewer,
  TimeWindow,
  communication,
  humain,
  isDraft,
} from "@overbookd/festival-activity";
import { activityCategories } from "~/utils/festival-event/festival-activity.model";
import { IProvidePeriod } from "@overbookd/period";

const comcomEmail = "communication@24heures.org";
const humainEmail = "humain@24heures.org";

export default defineComponent({
  name: "FaGeneralCard",
  components: { RichEditor, FaTimeWindowTable },
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
    reviewer(): typeof communication | typeof humain {
      return this.isPublic ? communication : humain;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(this.reviewer);
    },
    cantApprove(): boolean {
      if (isDraft(this.mFA)) return true;
      switch (this.reviewer) {
        case humain:
          return this.mFA.reviews.humain === APPROVED;
        case communication:
          return this.mFA.reviews.communication === APPROVED;
      }
    },
  },
  methods: {
    updateName(name: string) {
      this.$accessor.festivalActivity.updateGeneral({ name });
    },
    updateToPublish(canBeNull: boolean) {
      const toPublish = canBeNull === true;
      this.$accessor.festivalActivity.updateGeneral({ toPublish });
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

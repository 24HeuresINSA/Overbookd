<template>
  <v-card class="public-activity-card">
    <v-btn class="public-activity-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="public-activity-card__title">
      <h2>Publier une activité</h2>
    </v-card-title>
    <v-card-subtitle>
      Ta FA est en attente de relecture. Pour la publier, tu dois renseigner les
      informations suivantes.
    </v-card-subtitle>

    <v-card-text>
      <FaTimeWindowFormFields
        v-show="mustHaveAtLeastOneTimeWindow"
        :start="start"
        :end="end"
        @update:start="updateStart"
        @update:end="updateEnd"
      />

      <v-combobox
        v-show="mustHaveAtLeastOneCategory"
        v-model="categories"
        chips
        multiple
        clearable
        dense
        label="Catégories de l'activité"
        :items="categoryValues"
      />

      <v-text-field
        v-show="mustHavePhotoLink"
        v-model="photoLink"
        label="Lien de la photo de l'activité sur le drive"
      />
    </v-card-text>

    <v-card-actions class="public-activity-card__actions">
      <v-btn
        :disabled="!canPublishActivity"
        color="primary"
        large
        @click="publishActivity"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Publier l'activité
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaTimeWindowFormFields from "~/components/molecules/festival-event/time-window/FaTimeWindowFormFields.vue";
import { FestivalActivity } from "@overbookd/festival-event";
import { activityCategories } from "~/utils/festival-event/festival-activity/festival-activity.model";
import { IProvidePeriod, Period } from "@overbookd/period";
import { hasAtLeastOneItem } from "@overbookd/list";

type AskPublicDataFormCardData = IProvidePeriod & {
  categories: string[];
  photoLink: string | null;
};

export default defineComponent({
  name: "AskPublicDataFormCard",
  components: { FaTimeWindowFormFields },
  data: (): AskPublicDataFormCardData => ({
    start: new Date(),
    end: new Date(),
    categories: [],
    photoLink: null,
  }),
  computed: {
    general(): FestivalActivity["general"] {
      return this.$accessor.festivalActivity.selectedActivity.general;
    },
    mustHaveAtLeastOneTimeWindow(): boolean {
      return !hasAtLeastOneItem(this.general.timeWindows);
    },
    mustHaveAtLeastOneCategory(): boolean {
      return !hasAtLeastOneItem(this.general.categories);
    },
    mustHavePhotoLink(): boolean {
      return this.general.photoLink === null;
    },
    categoryValues(): string[] {
      return activityCategories;
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    period(): IProvidePeriod {
      return {
        start: this.start,
        end: this.end,
      };
    },
    canPublishActivity(): boolean {
      const isTimeWindowValid = Period.isValid(this.period);
      const isPhotoLinkValid =
        this.photoLink !== null && this.photoLink.trim() !== "";
      const hasAtLeastOneCategory = hasAtLeastOneItem(this.categories);

      return isTimeWindowValid && isPhotoLinkValid && hasAtLeastOneCategory;
    },
  },
  mounted() {
    this.resetFields();
  },
  methods: {
    async publishActivity() {
      if (!hasAtLeastOneItem(this.general.timeWindows)) {
        await this.$accessor.festivalActivity.addGeneralTimeWindow(this.period);
      }
      await this.$accessor.festivalActivity.updateGeneral({
        toPublish: true,
        categories: this.categories,
        photoLink: this.photoLink,
      });
      this.closeDialog();
      this.resetFields();
    },
    resetFields() {
      this.start = this.eventStartDate;
      this.end = this.eventStartDate;
      this.categories = this.general.categories;
      this.photoLink = this.general.photoLink;
    },
    updateStart(start: Date) {
      this.start = start;
    },
    updateEnd(end: Date) {
      this.end = end;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.public-activity-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>

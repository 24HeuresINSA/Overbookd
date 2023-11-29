<template>
  <v-card>
    <v-card-title>Général</v-card-title>

    <v-card-subtitle>
      N'hésite pas si tu as des questions à contacter
      <a href="mailto:humain@24heures.org">humain@24heures.org</a> ou
      <a href="mailto:comcom@24heures.org">comcom@24heures.org</a> si ton
      activité est à publier. Tu peux aussi t'aider en allant voir les FA de
      l'année dernière sur
      <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a> en te
      connectant avec jeuneetcon@24heures.org.
    </v-card-subtitle>

    <v-card-text>
      <v-text-field
        :value="general.name"
        label="Nom de l'activité"
        @change="updateName($event)"
      />
      <v-label>Description</v-label>
      <RichEditor
        :data="general.description ?? ''"
        label="Description"
        class="mb-4"
        @change="updateDescription($event)"
      />

      <h2>Créneau de l'animation</h2>
      <FaTimeWindowTable
        :time-windows="general.timeWindows"
        @add="addTimeWindow($event)"
        @update="updateTimeWindow($event)"
        @delete="deleteTimeWindow($event)"
      />

      <v-switch
        :value="general.toPublish"
        label="Publier sur le site / plaquette"
        @change="updateToPublish($event)"
      />
      <div v-if="general.toPublish">
        <v-text-field
          :value="general.photoLink"
          label="Lien de la photo de l'activité sur le drive"
          @change="updatePhotoLink($event)"
        />
        <v-combobox
          :value="general.categories"
          chips
          multiple
          clearable
          dense
          label="Categories de l'animations"
          :items="categories"
          @change="updateCategories($event)"
        />
        <v-switch
          :input-value="general.isFlagship"
          label="Animation phare qui sera mise en avant sur les réseaux sociaux"
          @change="updateIsFlagship($event)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/timeWindow/FaTimeWindowTable.vue";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-activity";
import { activityCategories } from "~/utils/models/festival-activity.model";
import { IProvidePeriod } from "@overbookd/period";

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
  },
  methods: {
    updateName(name: string) {
      console.log("update name", name);
      // TODO: update name
    },
    updateDescription(description: string) {
      console.log("update description", description);
      // TODO: update description
    },
    updateToPublish(toPublish: boolean) {
      console.log("update toPublish", toPublish);
      // TODO: update toPublish
    },
    updatePhotoLink(photoLink: string) {
      console.log("update photoLink", photoLink);
      // TODO: update photoLink
    },
    updateCategories(categories: string[]) {
      console.log("update categories", categories);
      // TODO: update categories
    },
    updateIsFlagship(isFlagship: boolean) {
      console.log("update isFlagship", isFlagship);
      // TODO: update isFlagship
    },
    addTimeWindow(period: IProvidePeriod) {
      console.log("add timeWindow", period);
      // TODO: add timeWindow
    },
    updateTimeWindow(timeWindow: TimeWindow) {
      console.log("update timeWindow", timeWindow);
      // TODO: update timeWindow
    },
    deleteTimeWindow(timeWindow: TimeWindow) {
      console.log("delete timeWindow", timeWindow);
      // TODO: delete timeWindow
    },
  },
});
</script>

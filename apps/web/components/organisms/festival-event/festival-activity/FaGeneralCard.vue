<template>
  <v-card>
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
        @change="updateName($event)"
      />
      <v-label>Description</v-label>
      <RichEditor
        :data="general.description ?? ''"
        label="Description"
        class="mb-4"
        @change="updateDescription($event)"
      />

      <article class="time-window">
        <h2>Créneau de l'animation</h2>
        <FaTimeWindowTable
          :time-windows="general.timeWindows"
          @add="addTimeWindow($event)"
          @delete="deleteTimeWindow($event)"
        />
      </article>

      <v-switch
        :value="general.toPublish"
        label="Publier sur le site / plaquette"
        @change="updateToPublish($event)"
      />
      <form v-if="general.toPublish">
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
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-activity";
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
    deleteTimeWindow(timeWindow: TimeWindow) {
      console.log("delete timeWindow", timeWindow);
      // TODO: delete timeWindow
    },
  },
});
</script>

<template>
  <div>
    <v-card>
      <v-card-title>Général</v-card-title>
      <v-card-subtitle>
        Si tu as des questions, n'hésite pas à contacter
        <a :href="`mailto:${contact}`"> {{ contact }} </a>.
        <br />
        Tu peux aussi t'aider en allant voir les FA de l'année dernière sur
        <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a>
        en te connectant avec {{ CTMA_EMAIL }}.
      </v-card-subtitle>

      <v-card-text>
        <v-text-field
          :model-value="general.name"
          label="Nom de l'activité"
          @update:model-value="updateName"
        />

        <v-switch
          :model-value="general.toPublish"
          label="Publier sur le site / plaquette"
          :false-value="false"
          color="primary"
          @update:model-value="updateToPublishOrAskPublic"
        />

        <h3>Description de l'activité</h3>
        <RichEditor
          :model-value="general.description ?? ''"
          @update:model-value="updateDescription"
        />

        <v-combobox
          :model-value="general.categories"
          label="Catégories de l'activité"
          :items="activityCategories"
          class="mt-4"
          chips
          multiple
          clearable
          @update:model-value="updateCategories"
        />

        <v-text-field
          v-show="general.toPublish"
          :model-value="general.photoLink"
          label="Lien de la photo de l'activité sur le drive"
          @update:model-value="updatePhotoLink"
        />

        <v-switch
          v-show="general.toPublish"
          :model-value="general.isFlagship"
          label="Activité phare qui sera mise en avant sur les réseaux sociaux"
          :false-value="false"
          color="primary"
          hide-details
          @update:model-value="updateIsFlagship"
        />

        <h3>Créneaux de l'activité</h3>
        <FaTimeWindowTable
          :time-windows="general.timeWindows"
          @add="addTimeWindow"
          @remove="removeTimeWindow"
        />
      </v-card-text>
    </v-card>

    <v-dialog v-model="isAskPublicDialogOpen" max-width="600">
      <AskPublicActivityDialogCard @close="closeAskPublicDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  type FestivalActivity,
  type TimeWindow,
  isDraft,
} from "@overbookd/festival-event";
import type { IProvidePeriod } from "@overbookd/time";
import { activityCategories } from "~/utils/festival-event/festival-activity/festival-activity.model";
import {
  COMMUNICATION_EMAIL,
  HUMAINS_EMAIL,
  CTMA_EMAIL,
} from "~/utils/mail/mail.constant";

const faStore = useFestivalActivityStore();

const isAskPublicDialogOpen = ref<boolean>(false);
const openAskPublicDialog = () => (isAskPublicDialogOpen.value = true);
const closeAskPublicDialog = () => (isAskPublicDialogOpen.value = false);

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const general = computed<FestivalActivity["general"]>(
  () => selectedActivity.value.general,
);
const isPublic = computed<boolean>(() => general.value.toPublish === true);
const contact = computed<string>(() =>
  isPublic.value ? COMMUNICATION_EMAIL : HUMAINS_EMAIL,
);

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const updateName = (name: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(() => faStore.updateGeneral({ name }), 800);
};
const updateDescription = (description: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(
    () => faStore.updateGeneral({ description: description || null }),
    800,
  );
};
const updatePhotoLink = (photoLink: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(
    () => faStore.updateGeneral({ photoLink: photoLink || null }),
    800,
  );
};
const updateCategories = (categories: string[]) => {
  return faStore.updateGeneral({ categories });
};
const updateIsFlagship = (isFlagship: boolean | null) => {
  return faStore.updateGeneral({ isFlagship: isFlagship || false });
};
const updateToPublishOrAskPublic = (canBeNull: boolean | null) => {
  const toPublish = canBeNull === true;
  if (toPublish === true && !isDraft(selectedActivity.value)) {
    return openAskPublicDialog();
  }
  faStore.updateGeneral({ toPublish });
};

const addTimeWindow = (period: IProvidePeriod) => {
  faStore.addGeneralTimeWindow(period);
};
const removeTimeWindow = (timeWindow: TimeWindow) => {
  faStore.removeGeneralTimeWindow(timeWindow.id);
};
</script>

<style lang="scss" scoped>
.time-window-table {
  margin: 15px 0 30px 0;
  padding: 5px;
}
</style>

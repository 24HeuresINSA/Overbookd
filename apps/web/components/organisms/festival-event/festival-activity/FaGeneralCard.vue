<template>
  <div>
    <v-card>
      <v-card-title>Général</v-card-title>
      <v-card-subtitle>
        Si tu as des questions, n'hésite pas à contacter
        <a :href="`mailto:${contact}`"> {{ contact }} </a>.
        <br />
        Tu peux aussi t'aider en allant voir les FA de l'année dernière sur
        <a :href="CTMA_URL">cetaitmieuxavant</a>
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
          scope="activity-description"
          :model-value="description ?? ''"
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

        <div class="time-windows-title">
          <h3>Créneaux de l'activité</h3>
          <v-btn
            icon="mdi-calendar-blank"
            aria-label="Ouvrir le planning"
            title="Ouvrir le planning"
            color="secondary"
            rounded="pill"
            density="comfortable"
            @click="openCalendar"
          />
        </div>
        <FaTimeWindowTable
          :time-windows="general.timeWindows"
          @add="addTimeWindow"
          @update="updateTimeWindow"
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
import { useDebounceFn } from "@vueuse/core";
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
import { CTMA_URL } from "~/utils/navigation/url.constant";

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

const emit = defineEmits(["open:calendar"]);
const openCalendar = () => emit("open:calendar");

const updateName = useDebounceFn((name: string) => {
  faStore.updateGeneral({ name });
}, 800);

const description = ref<string>(general.value.description ?? "");
const updateDescription = useDebounceFn((description?: string) => {
  faStore.updateGeneral({ description: description || null });
}, 800);

const updatePhotoLink = useDebounceFn((photoLink: string) => {
  faStore.updateGeneral({ photoLink: photoLink || null });
}, 800);
const updateCategories = (categories: string[]) => {
  const isValid = categories.every((category) =>
    activityCategories.includes(category),
  );
  if (!isValid) return;
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
const updateTimeWindow = (timeWindow: TimeWindow) => {
  faStore.updateGeneralTimeWindow(timeWindow);
};
const removeTimeWindow = (timeWindow: TimeWindow) => {
  faStore.removeGeneralTimeWindow(timeWindow.id);
};

const selectedActitivtyId = computed<number>(() => selectedActivity.value.id);
watch(selectedActitivtyId, (newId, oldId) => {
  if (newId !== oldId) {
    description.value = selectedActivity.value.general.description ?? "";
  }
});
</script>

<style scoped>
.time-windows-title {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>

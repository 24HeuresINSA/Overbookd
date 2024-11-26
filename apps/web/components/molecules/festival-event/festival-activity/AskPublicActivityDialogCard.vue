<template>
  <DialogCard @close="close">
    <template #title> Publier une activité </template>
    <template #subtitle>
      Ta FA est en attente de relecture. Pour la publier, tu dois renseigner les
      informations suivantes.
    </template>

    <template #content>
      <PeriodFormFields
        v-if="mustHaveAtLeastOneTimeWindow"
        v-model:start="start"
        v-model:end="end"
      />

      <v-combobox
        v-show="mustHaveAtLeastOneCategory"
        v-model="categories"
        :items="activityCategories"
        label="Catégories de l'activité"
        chips
        multiple
        clearable
      />

      <v-text-field
        v-show="mustHavePhotoLink"
        v-model="photoLink"
        label="Lien de la photo de l'activité sur le drive"
      />
    </template>

    <template #actions>
      <v-btn
        text="Publier l'activité"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="!canPublishActivity"
        size="large"
        @click="publishActivity"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";
import { activityCategories } from "~/utils/festival-event/festival-activity/festival-activity.model";
import { type IProvidePeriod, Period } from "@overbookd/time";
import { hasAtLeastOneItem } from "@overbookd/list";

const faStore = useFestivalActivityStore();
const configurationStore = useConfigurationStore();

const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(configurationStore.eventStartDate);
const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));

const general = computed<FestivalActivity["general"]>(
  () => faStore.selectedActivity.general,
);
const categories = ref<string[]>(general.value.categories);
const photoLink = ref<string | null>(general.value.photoLink);

const mustHaveAtLeastOneTimeWindow = computed<boolean>(
  () => !hasAtLeastOneItem(general.value.timeWindows),
);
const mustHaveAtLeastOneCategory = computed<boolean>(
  () => !hasAtLeastOneItem(general.value.categories),
);
const mustHavePhotoLink = computed<boolean>(
  () => general.value.photoLink === null,
);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const canPublishActivity = computed<boolean>(() => {
  const isTimeWindowValid =
    !mustHaveAtLeastOneTimeWindow.value || Period.isValid(period.value);
  const isPhotoLinkValid =
    photoLink.value !== null && photoLink.value.trim() !== "";
  const hasAtLeastOneCategory = hasAtLeastOneItem(categories.value);
  return isTimeWindowValid && isPhotoLinkValid && hasAtLeastOneCategory;
});
const publishActivity = async () => {
  if (mustHaveAtLeastOneTimeWindow.value) {
    await faStore.addGeneralTimeWindow(period.value);
  }
  await faStore.updateGeneral({
    toPublish: true,
    categories: categories.value,
    photoLink: photoLink.value,
  });
  close();
};
</script>

<template>
  <v-card>
    <v-card-title> Demande de matos </v-card-title>

    <v-card-text>
      <v-form v-show="!disabled" class="inquiry-form">
        <InquiryFormFields
          v-model:gear="gear"
          v-model:quantity="quantity"
          class="inquiry-form__fields"
          ponctual-usage
          hide-details
        />
        <v-btn
          icon="mdi-plus"
          color="primary"
          class="inquiry-form__btn"
          :disabled="cantAddInquiry"
          @click="addInquiry"
        />
      </v-form>

      <InquiryTable
        :inquiries="inquiries"
        :time-windows="timeWindows"
        :owner="MATOS"
        :disabled="disabled"
        @link-drive="linkDrive"
        @remove="removeInquiry"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  type AssignDrive,
  type FestivalTask,
  type InquiryRequest,
  MATOS,
  type TimeWindow,
} from "@overbookd/festival-event";
import type { CatalogGear } from "@overbookd/http";

const ftStore = useFestivalTaskStore();

const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const gear = ref<CatalogGear | undefined>();
const quantity = ref(1);

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const inquiries = computed<FestivalTask["inquiries"]>(
  () => selectedTask.value.inquiries,
);
const timeWindows = computed<TimeWindow[]>(
  () => selectedTask.value.mobilizations,
);

const cantAddInquiry = computed<boolean>(
  () => !gear.value || quantity.value <= 0,
);

const addInquiry = () => {
  if (!cantAddInquiry.value) {
    const inquiry = {
      slug: gear.value?.slug ?? "",
      quantity: quantity.value,
    };
    ftStore.addInquiryRequest(inquiry);
    gear.value = undefined;
    quantity.value = 1;
  }
};
const linkDrive = (link: AssignDrive) => ftStore.linkDrive(link);
const removeInquiry = (inquiry: InquiryRequest) =>
  ftStore.removeInquiryRequest(inquiry.slug);
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 10px 0 20px 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin: 10px 0 20px 0;
  }
}
</style>

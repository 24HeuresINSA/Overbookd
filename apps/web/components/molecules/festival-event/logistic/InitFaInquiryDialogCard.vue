<template>
  <DialogCard @close="close">
    <template #title> Initialiser une demande de matos </template>

    <template #content>
      <PeriodFormFields v-model:start="start" v-model:end="end" />
      <h3>Matos</h3>
      <InquiryFormFields v-model:gear="gear" v-model:quantity="quantity" />
    </template>

    <template #actions>
      <v-btn
        text="Initialiser la demande de matos"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="cantInitInquiry"
        size="large"
        @click="initInquiry"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { CatalogGear, InitInquiryRequest } from "@overbookd/http";
import { type IProvidePeriod, Period } from "@overbookd/time";

const configurationStore = useConfigurationStore();
const faStore = useFestivalActivityStore();

const gear = ref<CatalogGear | undefined>();
const quantity = ref<number>(1);
const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(configurationStore.eventStartDate);

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const isPeriodInvalid = computed<boolean>(() => !Period.isValid(period.value));
const cantAddInquiry = computed<boolean>(
  () => !gear.value && quantity.value <= 0,
);
const cantInitInquiry = computed<boolean>(
  () => cantAddInquiry.value || isPeriodInvalid.value,
);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const initInquiry = () => {
  if (cantInitInquiry.value) return;

  const form: InitInquiryRequest = {
    timeWindow: period.value,
    request: {
      slug: gear.value?.slug ?? "",
      quantity: quantity.value,
    },
  };
  faStore.initInquiry(form);
  close();

  gear.value = undefined;
  quantity.value = 1;
  start.value = configurationStore.eventStartDate;
  end.value = configurationStore.eventStartDate;
};
</script>

<style lang="css" scoped>
:deep(h3) {
  margin-bottom: 5px;
}
</style>

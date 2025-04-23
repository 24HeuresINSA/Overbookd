<template>
  <DesktopPageTitle :title="pageTitle" />
  <div class="borrow">
    <v-card>
      <v-card-title>Informations sur l'emprunt</v-card-title>
      <v-card-text class="borrow-info">
        <v-text-field
          :model-value="selectedBorrow.lender"
          label="Prêteur"
          hide-details
          @update:model-value="updateSeller"
        />
        <div class="borrow-info__period">
          <DateTimeField
            :model-value="selectedBorrow.availableOn"
            label="Date de disponibilité"
            hide-details
            @update:model-value="updateAvailableOn"
          />
          <DateTimeField
            :model-value="selectedBorrow.unavailableOn"
            label="Date de retour"
            hide-details
            @update:model-value="updateUnavailableOn"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="gear-list__title">
        <span>Matos à emprunter</span>
        <v-icon
          icon="mdi-export"
          color="secondary"
          rounded="pill"
          density="comfortable"
          @click="exportCSv"
        />
      </v-card-title>
      <v-card-text>
        <BasicGearRequestFormTable
          :gears="selectedBorrow.gears"
          no-data-text="Aucun matos à emprunter"
          @add="addGearRequest"
          @remove="removeGearRequest"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { GearRequest, Borrow } from "@overbookd/logistic";
import { BORROW_GEARS_URL } from "@overbookd/web-page";
import { CSVBuilder } from "@overbookd/csv";
import { downloadCsv } from "~/utils/file/download.utils";

const route = useRoute();
const borrowStore = useBorrowStore();

const selectedBorrow = computed<Borrow>(() => borrowStore.selected);
const lender = computed<string>(() => selectedBorrow.value.lender);
const borrowIdFromUrl = computed<number>(() => +route.params.borrowId);

const pageTitle = computed<string>(
  () => `Fiche Emprunt n°${borrowIdFromUrl.value}`,
);
const headTitle = computed<string>(() => {
  const displayedName = lender.value ? ` - ${lender.value}` : "";
  return `Emprunt ${borrowIdFromUrl.value}${displayedName}`;
});

onMounted(async () => {
  await borrowStore.fetchOne(borrowIdFromUrl.value);
  if (selectedBorrow.value.id !== borrowIdFromUrl.value) {
    navigateTo(BORROW_GEARS_URL);
  }
});

useHead({ title: headTitle.value });
watch(lender, () => (document.title = headTitle.value));

const updateSeller = (lender: string) => {
  borrowStore.plan({ lender });
};
const updateAvailableOn = (availableOn: Date) => {
  borrowStore.plan({ availableOn });
};
const updateUnavailableOn = (unavailableOn: Date) => {
  borrowStore.plan({ unavailableOn });
};

const addGearRequest = (gear: GearRequest) => {
  borrowStore.addGearRequest(gear);
};
const removeGearRequest = (gear: GearRequest) => {
  borrowStore.removeGearRequest(gear.slug);
};

const exportCSv = () => {
  const csv = CSVBuilder.from(selectedBorrow.value.gears).build();
  downloadCsv(selectedBorrow.value.lender, csv);
};
</script>

<style lang="scss" scoped>
.borrow {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.borrow-info {
  display: flex;
  gap: 1em;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 0.2em;
  }
  &__period {
    display: flex;
    gap: 1em;
    @media screen and (max-width: $mobile-max-width) {
      flex-direction: column;
      gap: 0.2em;
    }
  }
}

.gear-list__title {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>

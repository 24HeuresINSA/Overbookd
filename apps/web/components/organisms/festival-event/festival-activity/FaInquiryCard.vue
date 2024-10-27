<template>
  <div>
    <v-card>
      <v-card-title>Demande de matos</v-card-title>
      <v-card-subtitle>
        Si tu as des questions, demande aux orgas matos, élec ou barrières !
      </v-card-subtitle>

      <v-card-text>
        <div v-show="shouldInitInquiry" class="init-inquiry">
          <p>
            Tu n'as aucune demande de matos et ta FA est en relecture. Pour
            ajouter une demande, tu dois initialiser une demande en ajoutant un
            créneau et un matos.
          </p>
          <v-btn
            v-show="shouldInitInquiry"
            text="Initialiser une demande de matos"
            color="primary"
            class="init-inquiry__btn"
            @click="openInitInquiryDialog"
          />
        </div>
        <div v-show="canClearInquiry" class="init-inquiry">
          <p>
            Tu as déjà des demandes de matos et ta FA est en relecture. Pour
            supprimer <strong>toutes</strong> tes demandes et les crénaux
            associés tu dois les réinitialiser.
          </p>
          <v-btn
            v-show="canClearInquiry"
            text="Réinitialiser les demandes de matos"
            color="deep-orange"
            class="init-inquiry__btn"
            @click="clearInquiry"
          />
        </div>

        <div class="time-windows-title">
          <h3>Créneaux des demandes</h3>
          <v-btn
            icon="mdi-calendar-blank"
            color="secondary"
            rounded="pill"
            density="comfortable"
            @click="openCalendar"
          />
        </div>
        <FaTimeWindowTable
          :time-windows="inquiry.timeWindows"
          :disabled="shouldInitInquiry"
          @add="addTimeWindow"
          @remove="removeTimeWindow"
        />

        <v-form v-show="!shouldInitInquiry" class="inquiry-form">
          <InquiryFormFields
            v-model:gear="gear"
            v-model:quantity="quantity"
            class="inquiry-form__fields"
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

        <v-card class="inquiry-table">
          <v-card-title>Matos</v-card-title>
          <InquiryTable
            :inquiries="inquiry.gears"
            :time-windows="inquiry.timeWindows"
            :owner="MATOS"
            :hide-drive="shouldHideDrive"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>

        <v-card class="inquiry-table">
          <v-card-title>Elec</v-card-title>
          <InquiryTable
            :inquiries="inquiry.electricity"
            :time-windows="inquiry.timeWindows"
            :owner="ELEC"
            :hide-drive="shouldHideDrive"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>

        <v-card class="inquiry-table">
          <v-card-title>Barrières</v-card-title>
          <InquiryTable
            :inquiries="inquiry.barriers"
            :time-windows="inquiry.timeWindows"
            :owner="BARRIERES"
            :hide-drive="shouldHideDrive"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isInitInquiryDialogOpen" max-width="600">
      <InitFaInquiryDialogCard @close="closeInitInquiryDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  type FestivalActivity,
  type InquiryRequest,
  MATOS,
  ELEC,
  BARRIERES,
  type TimeWindow,
  type AssignDrive,
  isDraft,
} from "@overbookd/festival-event";
import type { CatalogGear } from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/time";

const faStore = useFestivalActivityStore();

const gear = ref<CatalogGear | undefined>();
const quantity = ref<number>(1);

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const inquiry = computed<FestivalActivity["inquiry"]>(
  () => selectedActivity.value.inquiry,
);

const allInquiryRequests = computed<InquiryRequest[]>(() => [
  ...inquiry.value.gears,
  ...inquiry.value.electricity,
  ...inquiry.value.barriers,
]);
const hasInquiry = computed<boolean>(() => allInquiryRequests.value.length > 0);
const shouldInitInquiry = computed<boolean>(
  () => !isDraft(selectedActivity.value) && !hasInquiry.value,
);
const isInitInquiryDialogOpen = ref<boolean>(false);
const openInitInquiryDialog = () => (isInitInquiryDialogOpen.value = true);
const closeInitInquiryDialog = () => (isInitInquiryDialogOpen.value = false);

const canClearInquiry = computed<boolean>(() => {
  if (isDraft(selectedActivity.value)) {
    return false;
  }
  return hasInquiry.value;
});
const clearInquiry = () => faStore.clearInquiry();

const cantAddInquiry = computed<boolean>(() => {
  return !gear.value || quantity.value <= 0;
});
const addInquiry = () => {
  if (cantAddInquiry.value) return;
  const inquiry = {
    slug: gear.value?.slug ?? "",
    quantity: quantity.value,
  };
  faStore.addInquiryRequest(inquiry);
  gear.value = undefined;
  quantity.value = 1;
};
const removeInquiry = (inquiry: InquiryRequest) => {
  faStore.removeInquiryRequest(inquiry.slug);
};

const emit = defineEmits(["open:calendar"]);
const openCalendar = () => emit("open:calendar");

const shouldHideDrive = computed<boolean>(() => {
  return isDraft(selectedActivity.value);
});
const linkDrive = (link: AssignDrive) => faStore.linkDrive(link);

const addTimeWindow = (period: IProvidePeriod) => {
  faStore.addInquiryTimeWindow(period);
};
const removeTimeWindow = (timeWindow: TimeWindow) => {
  faStore.removeInquiryTimeWindow(timeWindow.id);
};
</script>

<style lang="scss" scoped>
.inquiry-table {
  margin: 15px 0 30px 0;
  padding: 5px;
  &__title {
    font-size: 1.1rem;
  }
}

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

.init-inquiry {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 20px;
  &__btn {
    max-width: fit-content;
    margin-left: auto;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 0.2em;
    &__btn {
      margin-left: 0;
    }
  }
}

.time-windows-title {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>

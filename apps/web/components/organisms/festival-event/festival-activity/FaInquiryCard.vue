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
            color="primary"
            class="init-inquiry__btn"
            @click="openInitInquiryDialog"
          >
            Initialiser une demande de matos
          </v-btn>
        </div>
        <div v-show="canClearInquiry" class="init-inquiry">
          <p>
            Tu as déjà des demandes de matos et ta FA est en relecture. Pour
            supprimer <strong>toutes</strong> tes demandes et les crénaux
            associés tu dois les réinitialiser.
          </p>
          <v-btn
            v-show="canClearInquiry"
            color="deep-orange"
            dark
            class="init-inquiry__btn"
            @click="clearInquiry"
          >
            Réinitialiser les demandes de matos
          </v-btn>
        </div>

        <h3>
          Créneaux des demandes
          <v-btn fab dark small color="primary" @click="openCalendar">
            <v-icon dark> mdi-calendar-blank </v-icon>
          </v-btn>
        </h3>

        <FaTimeWindowTable
          :time-windows="inquiry.timeWindows"
          :disabled="shouldInitInquiry"
          @add="addTimeWindow"
          @remove="removeTimeWindow"
        />

        <v-form v-show="!shouldInitInquiry" class="inquiry-form">
          <InquiryFormFields
            class="inquiry-form__fields"
            :gear="gear"
            :quantity="quantity"
            @update:gear="updateGear"
            @update:quantity="updateQuantity"
          />
          <v-btn
            rounded
            color="primary"
            class="inquiry-form__btn"
            :disabled="!canAddInquiry"
            @click="addInquiry"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-form>

        <v-card class="inquiry-table">
          <div v-if="canReviewGears" class="review">
            <v-btn
              class="review__action"
              fab
              x-small
              color="success"
              :disabled="cantApproveGears"
              @click="openLinkDriveFor(MATOS)"
            >
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn
              class="review__action"
              fab
              x-small
              color="error"
              :disabled="cantRejectGears"
              @click="reject(MATOS)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
          <v-card-title class="inquiry-table__title">Matos</v-card-title>
          <InquiryTable
            :inquiries="inquiry.gears"
            :time-windows="inquiry.timeWindows"
            :owner="MATOS"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>

        <v-card class="inquiry-table">
          <div v-if="canReviewElec" class="review">
            <v-btn
              class="review__action"
              fab
              x-small
              color="success"
              :disabled="cantApproveElec"
              @click="openLinkDriveFor(ELEC)"
            >
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn
              class="review__action"
              fab
              x-small
              color="error"
              :disabled="cantRejectElec"
              @click="reject(ELEC)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
          <v-card-title class="inquiry-table__title">Elec</v-card-title>
          <InquiryTable
            :inquiries="inquiry.electricity"
            :time-windows="inquiry.timeWindows"
            :owner="ELEC"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>

        <v-card class="inquiry-table">
          <div v-if="canReviewBarriers" class="review">
            <v-btn
              class="review__action"
              fab
              x-small
              color="success"
              :disabled="cantApproveBarriers"
              @click="openLinkDriveFor(BARRIERES)"
            >
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn
              class="review__action"
              fab
              x-small
              color="error"
              :disabled="cantRejectBarriers"
              @click="reject(BARRIERES)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
          <v-card-title class="inquiry-table__title">Barrières</v-card-title>
          <InquiryTable
            :inquiries="inquiry.barriers"
            :time-windows="inquiry.timeWindows"
            :owner="BARRIERES"
            @link-drive="linkDrive"
            @remove="removeInquiry"
          />
        </v-card>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isInitInquiryDialogOpen" max-width="600">
      <FaInitInquiryFormCard
        @add="initInquiry"
        @close-dialog="closeInitInquiryDialog"
      />
    </v-dialog>

    <v-dialog v-model="isLinkDriveDialogOpen" max-width="600">
      <FaLinkDriveFormCard
        :inquiries="selectedInquiries"
        @completed="approve"
        @close-dialog="closeLinkDriveDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import FaLinkDriveFormCard from "~/components/molecules/festival-event/logistic/inquiry/FaLinkDriveFormCard.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import InquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/InquiryFormFields.vue";
import {
  FestivalActivity,
  InquiryRequest,
  MATOS,
  ELEC,
  BARRIERES,
  TimeWindow,
  InquiryOwner,
  isDraft,
  APPROVED,
  REJECTED,
  AssignDrive,
} from "@overbookd/festival-event";
import { InputRulesData } from "~/utils/rules/input.rules";
import { min, isNumber } from "~/utils/rules/input.rules";
import { IProvidePeriod } from "@overbookd/period";
import { CatalogGear, InitInquiryRequest } from "@overbookd/http";
import FaInitInquiryFormCard from "~/components/molecules/festival-event/logistic/inquiry/FaInitInquiryFormCard.vue";

type FaInquiryCardData = InputRulesData & {
  isInitInquiryDialogOpen: boolean;
  isLinkDriveDialogOpen: boolean;
  selectedOwner: InquiryOwner;
  gear: CatalogGear | null;
  quantity: number;

  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: {
    InquiryTable,
    InquiryFormFields,
    FaTimeWindowTable,
    FaInitInquiryFormCard,
    FaLinkDriveFormCard,
  },
  emits: ["reject", "open:calendar"],
  data: (): FaInquiryCardData => ({
    isInitInquiryDialogOpen: false,
    isLinkDriveDialogOpen: false,
    selectedOwner: MATOS,
    gear: null,
    quantity: 1,
    MATOS,
    ELEC,
    BARRIERES,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    inquiry(): FestivalActivity["inquiry"] {
      return this.mFA.inquiry;
    },
    allInquiryRequests(): InquiryRequest[] {
      return [
        ...this.inquiry.barriers,
        ...this.inquiry.electricity,
        ...this.inquiry.gears,
      ];
    },
    hasInquiry(): boolean {
      return (
        this.allInquiryRequests.length > 0 &&
        this.inquiry.timeWindows.length > 0
      );
    },
    shouldInitInquiry(): boolean {
      return !isDraft(this.mFA) && !this.hasInquiry;
    },
    canClearInquiry(): boolean {
      return this.hasInquiry;
    },
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
    canReviewGears(): boolean {
      return this.$accessor.user.isMemberOf(MATOS);
    },
    canReviewElec(): boolean {
      return this.$accessor.user.isMemberOf(ELEC);
    },
    canReviewBarriers(): boolean {
      return this.$accessor.user.isMemberOf(BARRIERES);
    },
    cantApproveGears(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.matos === APPROVED;
    },
    cantRejectGears(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.matos === REJECTED;
    },
    cantApproveElec(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.elec === APPROVED;
    },
    cantRejectElec(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.elec === REJECTED;
    },
    cantApproveBarriers(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.barrieres === APPROVED;
    },
    cantRejectBarriers(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.barrieres === REJECTED;
    },
    selectedInquiries(): InquiryRequest[] {
      switch (this.selectedOwner) {
        case MATOS:
          return this.inquiry.gears;
        case BARRIERES:
          return this.inquiry.barriers;
        case ELEC:
          return this.inquiry.electricity;
        default:
          return [];
      }
    },
  },
  methods: {
    clearInquiryForm() {
      this.gear = null;
      this.quantity = 1;
    },
    initInquiry(form: InitInquiryRequest) {
      this.$accessor.festivalActivity.initInquiry(form);
    },
    addInquiry() {
      if (!this.canAddInquiry) return;
      const inquiry = {
        slug: this.gear?.slug ?? "",
        quantity: this.quantity,
      };
      this.$accessor.festivalActivity.addInquiryRequest(inquiry);
      this.clearInquiryForm();
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$accessor.festivalActivity.removeInquiryRequest(inquiry.slug);
    },
    linkDrive(link: AssignDrive) {
      this.$accessor.festivalActivity.linkDrive(link);
    },
    addTimeWindow(period: IProvidePeriod) {
      this.$accessor.festivalActivity.addInquiryTimeWindow(period);
    },
    removeTimeWindow(timeWindow: TimeWindow) {
      this.$accessor.festivalActivity.removeInquiryTimeWindow(timeWindow.id);
    },
    approve() {
      this.$accessor.festivalActivity.approveAs(this.selectedOwner);
    },
    reject(owner: InquiryOwner) {
      this.$emit("reject", owner);
    },
    openInitInquiryDialog(): void {
      this.isInitInquiryDialogOpen = true;
    },
    closeInitInquiryDialog(): void {
      this.isInitInquiryDialogOpen = false;
    },
    openLinkDriveFor(owner: InquiryOwner) {
      this.selectedOwner = owner;
      this.isLinkDriveDialogOpen = true;
    },
    closeLinkDriveDialog() {
      this.isLinkDriveDialogOpen = false;
    },
    clearInquiry() {
      this.$accessor.festivalActivity.clearInquiry();
    },
    updateGear(gear: CatalogGear | null) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
    },
    openCalendar() {
      this.$emit("open:calendar");
    },
  },
});
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
  margin-top: 10px;
  margin-bottom: 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin: 10px 0 30px 20px;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}

.init-inquiry {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-bottom: 20px;

  &__btn {
    max-width: fit-content;
    align-self: flex-end;
  }
}

.review {
  position: relative;
  height: 0;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-start;
}
</style>

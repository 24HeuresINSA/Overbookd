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

        <FaTimeWindowTable
          :time-windows="inquiry.timeWindows"
          :disabled="shouldInitInquiry"
          @add="addTimeWindow"
          @remove="removeTimeWindow"
        />

        <v-form v-show="!shouldInitInquiry" class="inquiry-form">
          <FaInquiryFormFields
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
              @click="approved(MATOS)"
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
            :owner="MATOS"
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
              @click="approved(ELEC)"
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
            :owner="ELEC"
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
              @click="approved(BARRIERES)"
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
            :owner="BARRIERES"
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import FaInquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/FaInquiryFormFields.vue";
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
} from "@overbookd/festival-activity";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData } from "~/utils/rules/input.rules";
import { min, isNumber } from "~/utils/rules/input.rules";
import { IProvidePeriod } from "@overbookd/period";
import { InitInquiryRequest } from "@overbookd/http";
import FaInitInquiryFormCard from "~/components/molecules/festival-event/logistic/inquiry/FaInitInquiryFormCard.vue";

type FaInquiryCardData = InputRulesData & {
  isInitInquiryDialogOpen: boolean;
  gear: Gear | null;
  quantity: number;

  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: {
    InquiryTable,
    FaInquiryFormFields,
    FaTimeWindowTable,
    FaInitInquiryFormCard,
  },
  emits: ["reject"],
  data: (): FaInquiryCardData => ({
    isInitInquiryDialogOpen: false,
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
    addTimeWindow(period: IProvidePeriod) {
      this.$accessor.festivalActivity.addInquiryTimeWindow(period);
    },
    removeTimeWindow(timeWindow: TimeWindow) {
      this.$accessor.festivalActivity.removeInquiryTimeWindow(timeWindow.id);
    },
    approved(owner: InquiryOwner) {
      this.$accessor.festivalActivity.approveAs(owner);
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
    updateGear(gear: Gear | null) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
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
  margin-bottom: 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin-left: 20px;
    margin-bottom: 30px;
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

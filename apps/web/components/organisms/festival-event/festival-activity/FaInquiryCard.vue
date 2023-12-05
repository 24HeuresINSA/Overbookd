<template>
  <div>
    <v-card>
      <v-card-title>Demande de matos</v-card-title>

      <v-card-text>
        <div v-show="shouldInitInquiry" class="init-inquiry">
          <p>
            Tu n'as aucune demande de matos et ta FA est en attente de
            validation. Pour ajouter une demande, tu dois initialiser une
            demande en ajoutant un créneau et un matos.
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
            @update-gear="updateGear"
            @update-quantity="updateQuantity"
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
          <div v-if="canReview" class="review">
            <v-btn class="review__action" fab x-small color="success">
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn class="review__action" fab x-small color="error">
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
          <div v-if="canReview" class="review">
            <v-btn class="review__action" fab x-small color="success">
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn class="review__action" fab x-small color="error">
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
          <div v-if="canReview" class="review">
            <v-btn class="review__action" fab x-small color="success">
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn class="review__action" fab x-small color="error">
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
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import FaInitInquiryFormCard from "~/components/molecules/festival-event/logistic/inquiry/FaInitInquiryFormCard.vue";
import FaInquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/FaInquiryFormFields.vue";
import {
  BARRIERES,
  ELEC,
  FestivalActivity,
  InquiryRequest,
  MATOS,
  TimeWindow,
  isDraft,
} from "@overbookd/festival-activity";
import { InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { Gear } from "~/utils/models/catalog.model";

type FaInquiryCardData = {
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
    FaTimeWindowTable,
    InquiryTable,
    FaInitInquiryFormCard,
    FaInquiryFormFields,
  },
  data: (): FaInquiryCardData => ({
    isInitInquiryDialogOpen: false,
    gear: null,
    quantity: 1,
    MATOS,
    ELEC,
    BARRIERES,
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
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
    shouldInitInquiry(): boolean {
      return !isDraft(this.mFA) && !this.hasInquiry;
    },
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
  },
  methods: {
    addInquiry() {
      const inquiry = {
        slug: this.gear?.slug ?? "",
        quantity: this.quantity,
      };
      this.$accessor.festivalActivity.addInquiryRequest(inquiry);

      this.gear = null;
      this.quantity = 1;
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
    initInquiry(form: InitInquiryRequest) {
      this.$accessor.festivalActivity.initInquiry(form);
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

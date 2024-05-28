<template>
  <div>
    <v-card>
      <div v-if="canReview" class="review">
        <v-btn
          class="review__action"
          fab
          x-small
          color="success"
          :disabled="cantApprove"
          @click="openLinkCatalogItemDialog"
        >
          <v-icon>mdi-check-circle-outline</v-icon>
        </v-btn>
        <v-btn
          class="review__action"
          fab
          x-small
          color="error"
          :disabled="cantReject"
          @click="reject"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </div>

      <v-card-title> Signa </v-card-title>
      <v-card-subtitle>
        Contacte la signa via
        <a href="mailto:signaletique@24heures.org">signaletique@24heures.org</a>
        pour ajouter des lieux non existants dans la liste déroulante.
      </v-card-subtitle>

      <v-card-text>
        <SearchSignaLocation
          :location="signa.location"
          label="Lieu"
          :boxed="false"
          @change="updateLocation"
        />

        <div class="signage">
          <h2 class="signage__title">Demande de signalétique</h2>
          <FaSignageTable
            :signages="signages"
            @update="openUpdateSignageDialog"
            @remove="removeSignage"
          />

          <v-btn
            color="primary"
            class="signage__add"
            @click="openAddSignageDialog"
          >
            Ajouter une signalétique
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isSignageDialogOpen" max-width="600">
      <FaSignageForm
        :signage="selectedSignage"
        @add="addSignage"
        @update="updateSignage"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>

    <v-dialog v-model="isLinkCatalogItemDialogOpen" max-width="800">
      <FaLinkCatalogItemFormCard
        :signages="signages"
        @completed="approve"
        @close-dialog="closeLinkCatalogItemDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  FestivalActivity,
  Signage,
  Location,
  PrepareSignageCreation,
  isDraft,
  signa,
  REJECTED,
  APPROVED,
} from "@overbookd/festival-event";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signage/FaSignageTable.vue";
import FaLinkCatalogItemFormCard from "~/components/molecules/festival-event/logistic/signage/FaLinkCatalogItemFormCard.vue";
import FaSignageForm from "~/components/molecules/festival-event/logistic/signage/FaSignageForm.vue";

type SignaCardData = {
  isLinkCatalogItemDialogOpen: boolean;
  isSignageDialogOpen: boolean;
  selectedSignage: Signage | null;
};

export default defineComponent({
  name: "SignaCard",
  components: {
    SearchSignaLocation,
    FaSignageTable,
    FaLinkCatalogItemFormCard,
    FaSignageForm,
  },
  emits: ["reject"],
  data: (): SignaCardData => ({
    isLinkCatalogItemDialogOpen: false,
    isSignageDialogOpen: false,
    selectedSignage: null,
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    signa(): FestivalActivity["signa"] {
      return this.mFA.signa;
    },
    signages(): Signage[] {
      return this.signa.signages;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(signa);
    },
    cantApprove(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.signa === APPROVED;
    },
    cantReject(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.signa === REJECTED;
    },
  },
  methods: {
    updateLocation(location: Location | null) {
      const locationId = location?.id ?? null;
      this.$accessor.festivalActivity.updateSigna({ locationId });
    },
    addSignage(signage: PrepareSignageCreation) {
      this.$accessor.festivalActivity.addSignage(signage);
    },
    updateSignage(signage: Signage) {
      this.$accessor.festivalActivity.updateSignage(signage);
    },
    removeSignage(signage: Signage) {
      this.$accessor.festivalActivity.removeSignage(signage.id);
    },
    approve() {
      this.$accessor.festivalActivity.approveAs(signa);
    },
    reject() {
      this.$emit("reject", signa);
    },
    openLinkCatalogItemDialog() {
      this.isLinkCatalogItemDialogOpen = true;
    },
    closeLinkCatalogItemDialog() {
      this.isLinkCatalogItemDialogOpen = false;
    },
    openAddSignageDialog() {
      this.selectedSignage = null;
      this.isSignageDialogOpen = true;
    },
    closeAddDialog() {
      this.isSignageDialogOpen = false;
      this.selectedSignage = null;
    },
    openUpdateSignageDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isSignageDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isSignageDialogOpen = false;
      this.selectedSignage = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.signage {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  &__title {
    margin: 20px 0;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}

.review {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>

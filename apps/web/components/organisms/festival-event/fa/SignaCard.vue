<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title> Signa </v-card-title>
      <v-card-subtitle>
        Contacte la signa via
        <a href="mailto:signaletique@24heures.org">signaletique@24heures.org</a>
        pour ajouter des lieux non existants dans la liste déroulante.
      </v-card-subtitle>

      <v-card-text>
        <SearchSignaLocation
          :location="currentLocation"
          label="Lieu"
          :boxed="false"
          :disabled="isValidatedByOwner"
          @change="updateLocation($event)"
        ></SearchSignaLocation>

        <v-card-title> Besoin de signa </v-card-title>
        <SignaNeedTable
          :signa-needs="signaNeeds"
          :disabled="isValidatedByOwner"
          @update="openEditDialog"
          @delete="deleteSignaNeed"
        ></SignaNeedTable>
      </v-card-text>

      <v-card-actions v-if="!isValidatedByOwner">
        <v-spacer></v-spacer>
        <v-btn text @click="openAddDialog"> Ajouter un besoin de signa </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <SignaNeedForm
        @change="addSignaNeed"
        @close-dialog="closeAddDialog"
      ></SignaNeedForm>
    </v-dialog>
    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <SignaNeedForm
        :signa-need="selectedSignaNeed"
        @change="updateSignaNeed"
        @close-dialog="closeEditDialog"
      ></SignaNeedForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import SignaNeedForm from "~/components/molecules/festival-event/logistic/signaNeed/SignaNeedForm.vue";
import SignaNeedTable from "~/components/molecules/festival-event/logistic/signaNeed/SignaNeedTable.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import { Fa, FaCardType, FaSignaNeed } from "~/utils/models/fa.model";
import { SignaLocation } from "~/utils/models/signa-location.model";

export default Vue.extend({
  name: "SignaCard",
  components: {
    CardErrorList,
    SearchSignaLocation,
    SignaNeedTable,
    SignaNeedForm,
  },
  data: () => ({
    owner: "signa",
    cardType: FaCardType.SIGNA,

    isAddDialogOpen: false,
    isEditDialogOpen: false,

    selectedSignaNeed: null as FaSignaNeed | null,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    signaNeeds(): FaSignaNeed[] {
      return this.mFA.signaNeeds;
    },
    currentLocation(): SignaLocation | undefined {
      return this.mFA.location;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    updateLocation(location: SignaLocation) {
      this.$accessor.fa.updateFaChunk({ location });
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
    openEditDialog(signaNeed: FaSignaNeed) {
      this.selectedSignaNeed = signaNeed;
      this.isEditDialogOpen = true;
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.selectedSignaNeed = null;
    },
    addSignaNeed(signaNeed: FaSignaNeed) {
      this.$accessor.fa.addSignaNeed(signaNeed);
    },
    updateSignaNeed(signaNeed: FaSignaNeed) {
      this.$accessor.fa.updateSignaNeed(signaNeed);
    },
    deleteSignaNeed(signaNeed: FaSignaNeed) {
      this.$accessor.fa.deleteSignaNeed(signaNeed);
    },
  },
});
</script>

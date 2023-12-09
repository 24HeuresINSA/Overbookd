<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn
        class="review__action"
        fab
        x-small
        color="success"
        :disabled="cantApprove"
        @click="approved"
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

      <h2 class="signage-title">Demande de signalétique</h2>
      <FaSignageTable
        :signages="signa.signages"
        @add="addSignage"
        @update="updateSignage"
        @remove="removeSignage"
      />
    </v-card-text>
  </v-card>
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
} from "@overbookd/festival-activity";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signage/FaSignageTable.vue";

export default defineComponent({
  name: "SignaCard",
  components: {
    SearchSignaLocation,
    FaSignageTable,
  },
  emits: ["reject"],
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    signa(): FestivalActivity["signa"] {
      return this.mFA.signa;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(signa);
    },
    cantApprove(): boolean {
      if (isDraft(this.mFA)) return true;
      return true;
      //return this.mFA.reviews.signa === APPROVED;
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
    approved() {
      this.$accessor.festivalActivity.approveAs(signa);
    },
    reject() {
      this.$emit("reject", signa);
    },
  },
});
</script>

<style lang="scss" scoped>
.signage-title {
  margin: 20px 0;
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

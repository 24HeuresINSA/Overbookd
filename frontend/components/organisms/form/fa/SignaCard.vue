<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title>Signa</v-card-title>
      <v-card-subtitle
        >Contacte la signa à
        <a href="mailto:signaletique@24heures.org">signaletique@24heures.org</a>
        pour ajouter des lieux non existant dans la liste déroulante.
      </v-card-subtitle>
      <v-card-text>
        <v-autocomplete
          label="Lieux"
          :value="currentLocations"
          :items="locations"
          :disabled="isValidatedByOwner"
          item-text="name"
          item-value="id"
          @change="onChange('location_id', $event)"
        ></v-autocomplete>
        <v-switch
          v-model="isSignaRequired"
          label="Besoin signa"
          :disabled="isValidatedByOwner"
        ></v-switch>
        <div v-if="isSignaRequired">
          <v-data-table :headers="headers" :items="signalisations">
            <template #[`item.action`]="{ index }">
              <v-btn
                v-if="!isValidatedByOwner"
                icon
                @click="deleteSignalisation(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template #[`item.count`]="{ index, item }">
              <v-text-field
                :value="item.count ? item.count : '1'"
                label="Nombre"
                type="number"
                :rules="[rules.number, rules.min]"
                :disabled="isValidatedByOwner"
                @change="updateSignalisationCount(index, $event)"
              ></v-text-field>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <v-card-actions v-if="!isValidatedByOwner">
        <v-spacer></v-spacer>
        <v-btn text @click="isSignaFormOpen = true"
          >Ajouter une signalisation
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isSignaFormOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter une signalisation</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="newSignalisation.type"
              type="select"
              label="Type"
              :items="signaType"
              required
            ></v-select>

            <v-text-field
              v-model="newSignalisation.text"
              label="Texte signalétique"
              required
            ></v-text-field>

            <v-text-field
              v-model="newSignalisation.comment"
              label="Commentaire"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isSignaFormOpen = false"
            >Annuler</v-btn
          >
          <v-btn color="blue darken-1" text @click="addSignalisation"
            >Valider</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import {
  FA,
  fa_card_type,
  fa_signa_needs,
  signa_type,
} from "~/utils/models/FA";
import { SignaLocation } from "~/utils/models/signaLocation";
import { isNumber, min } from "~/utils/rules/inputRules";
import CardErrorList from "~/components/molecules/CardErrorList.vue";

export default Vue.extend({
  name: "SignaCard",
  components: { CardErrorList },
  data: () => ({
    owner: "signa",
    cardType: fa_card_type.SIGNA,
    isSignaRequired: false,
    isSignaFormOpen: false,
    headers: [
      { text: "Nombre", value: "count" },
      { text: "Type", value: "signa_type" },
      { text: "Texte signalétique", value: "text" },
      { text: "Commentaire", value: "comment" },
      { text: "Action", value: "action" },
    ],
    newSignalisation: {
      type: "",
      text: "",
      comment: "",
    },
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    signalisations(): fa_signa_needs[] {
      return this.mFA.fa_signa_needs ?? [];
    },
    signaType(): string[] {
      return Object.values(signa_type);
    },
    currentLocations(): SignaLocation | undefined {
      const locationId = this.$accessor.FA.mFA.location_id;
      if (!locationId) return undefined;
      return this.$accessor.signa.getLocationById(locationId);
    },
    locations(): SignaLocation[] {
      return this.$accessor.signa.locations;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  watch: {
    signalisations: {
      handler() {
        if (this.signalisations.length > 0) {
          this.isSignaRequired = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    addSignalisation() {
      if (!this.newSignalisation.type || !this.newSignalisation.text) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message:
            "❌ N'oublie pas de compléter le Type et le Texte signalétique !",
        });
      }

      const newSigna: fa_signa_needs = {
        signa_type: this.newSignalisation.type as signa_type,
        text: this.newSignalisation.text,
        count: 1,
        comment: this.newSignalisation.comment,
      };

      this.$accessor.FA.addSignaNeed(newSigna);
      this.isSignaFormOpen = false;
      this.newSignalisation = { type: "", text: "", comment: "" };
    },
    updateSignalisationCount(index: number, count: number) {
      this.$accessor.FA.updateSignaNeedCount({ index, count });
    },
    async deleteSignalisation(index: number) {
      await this.$accessor.FA.deleteSignaNeed(index);
    },
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>

<template>
  <div>
    <v-card :class="isDisabled ? 'disabled' : ''">
      <v-card-title>Signa</v-card-title>
      <v-card-subtitle
        >Contactez la signa à signaletique@24heures.org pour ajouter des lieux
        non existant dans la liste déroulante
      </v-card-subtitle>
      <v-card-text>
        <!--<v-autocomplete
          label="Lieux"
          multiple
          :value="currentLocations"
          :items="locations"
          :disabled="isDisabled"
          @change="selectLocations"
        ></v-autocomplete>-->
        <v-switch v-model="isSignaRequired" label="Besoin signa"></v-switch>
        <div v-if="isSignaRequired">
          <v-data-table :headers="headers" :items="signalisations">
            <template #[`item.action`]="{ index }">
              <v-btn
                v-if="!isDisabled"
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
                min="0"
                step="1"
                :disabled="isDisabled"
                @change="updateSignalisationCount(index, $event)"
              ></v-text-field>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <v-card-actions v-if="isSignaRequired && !isDisabled">
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
              dense
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
import { fa_signa_needs, SignaType } from "~/utils/models/FA";

export default Vue.extend({
  name: "SignaCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    isSignaRequired: false,
    isSignaFormOpen: false,
    headers: [
      { text: "Nombre", value: "count" },
      { text: "Type", value: "type" },
      { text: "Texte signalétique", value: "text" },
      { text: "Commentaire", value: "comment" },
      { text: "Action", value: "action" },
    ],
    newSignalisation: {
      type: "",
      text: "",
      comment: "",
    },
  }),
  computed: {
    signalisations(): any {
      return this.$accessor.FA.mFA.fa_signa_needs;
    },
    signaType(): Array<string> {
      return Object.values(SignaType);
    },
    /*currentLocations(): string[] {
      if (
        this.$accessor.FA.mFA.general &&
        this.$accessor.FA.mFA.general.locations
      ) {
        return this.$accessor.FA.mFA.general.locations;
      }
      return [];
    },addSignalisation
    locations(): any[] {
      return this.$accessor.location.signa.map((l) => l.name);
    },*/
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
  async mounted() {
    // await this.$accessor.location.getAllLocations();
  },
  methods: {
    /*selectLocations(locations: string[]) {
      this.$accessor.FA.setLocations(locations);
    },*/
    addSignalisation() {
      if (!this.newSignalisation.type || !this.newSignalisation.text) {
        alert("N'oublie pas de compléter le Type et le Texte signalétique !");
        /*this.$accessor.notif.pushNotification({
          type: "error",
          message:
            "N'oublie pas de compléter le Type et le Texte signalétique !",
        });*/
        return;
      }

      const newSigna: fa_signa_needs = {
        fa_id: +this.$route.params.fa,
        type: this.newSignalisation.type as SignaType,
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
    deleteSignalisation(index: number) {
      this.$accessor.FA.deleteSignaNeed(index);
    },
  },
});
</script>

<style scoped>
.disabled {
  border-left: 5px solid green;
}
</style>

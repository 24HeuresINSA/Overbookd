<template>
  <div>
    <v-dialog
      v-model="changeProposalForm"
      max-width="800"
      persistent
      scrollable
      @keydown.escape="closeDialog"
    >
      <v-card>
        <v-card-title> Proposition d'un objet </v-card-title>
        <v-card-text>
          <v-form ref="proposalForm" v-model="proposalValid">
            <v-container>
              <v-text-field
                v-model="item.name"
                label="Nom de l'objet"
                append-icon="mdi-search"
                single-line
                hide-details
                :rules="rules.name"
                required
              ></v-text-field>
              <v-select
                v-model="item.type"
                required
                :items="sortedEquipmentTypes"
                label="Catégorie/type"
                append-icon=""
                single-line
                :rules="rules.type"
              ></v-select>
              <v-text-field
                v-model="item.amount"
                label="Quantité"
                append-icon="mdi-search"
                single-line
                required
                type="number"
                :rules="rules.amount"
              ></v-text-field>

              <v-switch
                v-model="item.fromPool"
                :disabled="true"
                label="Vient du pool des assos ? 🐔"
              ></v-switch>
              <v-select
                v-model="item.location"
                :items="possibleLocations"
                label="Lieux de l'objet"
                item-text="name"
                :rules="rules.location"
                single-line
              ></v-select>
              <v-text-field
                v-model="item.preciseLocation"
                label="Espace de stockage exact"
                single-line
              ></v-text-field>
              <v-text-field
                v-model="item.comment"
                label="Commentaire"
                single-line
              ></v-text-field>
              <v-text-field
                v-model="item.referencePicture"
                label="Référence photo 📷"
                single-line
              ></v-text-field>
              <v-text-field
                v-model="item.referenceInvoice"
                label="Référence facture 📃"
                single-line
              ></v-text-field>
            </v-container>            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addEquipmentProposal">
            Envoyer la proposition
          </v-btn>
          <v-btn color="error" text @click="closeDialog"> Annuler </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import { Snack } from "~/utils/models/snack";

export default Vue.extend({
  name: "EquipmentProposalDialog",
  props: {
    equipment: Object,
    isNewEquipment: Boolean,
  },
  data(): any {
    return {
      changeProposalForm: false,
      proposalValid: false,
      rules: {
        name: [(v: string) => !!v || "Veuillez entrer un nom"],
        amount: [
          (v: number) => !!v || "Veuillez entrer une quantité",
          (v: number) => v >= 0 || "Veuillez entrer une quantité positive",
        ],
        location: [
          (v: string) => !!v || "Veuillez choisir un lieu de stockage",
        ],
        type: [(v: string) => !!v || "Veuillez choisir un type"],
      },
      newBorrow: {
        from: "",
        amount: "",
        start: "",
        end: "",
      },
      borrowedHeader: [
        {
          text: "qui",
          align: "left",
          value: "from",
        },
        {
          text: "quantite",
          align: "left",
          value: "amount",
        },
        {
          text: "debut",
          align: "left",
          value: "start",
        },
        {
          text: "fin",
          align: "left",
          value: "end",
        },
        {
          text: "",
          align: "right",
          value: "action",
        },
      ],
      borrowedProposal: [],
      item: _.cloneDeep(this.equipment),
      snack: new Snack(),
    };
  },
  computed: {
    possibleLocations(): any {
      return this.$accessor.location.locations.filter((e: any) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    sortedEquipmentTypes(): any {
      return [
        ...this.$accessor.config.getConfig("equipment_form")[1].options,
      ].sort();
    },
  },
  methods: {
    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },
    async addEquipmentProposal() {
      const form = this.$refs.proposalForm as HTMLFormElement;
      form.validate();
      if (!this.proposalValid) return;

      if (this.isNewEquipment) {
        this.item.isNewEquipment = this.isNewEquipment;
      } else {
        this.item.isNewEquipment = this.isNewEquipment;
        this.item.oldEquipment = this.item._id;
        delete this.item._id;
      }
      this.item.byUser = this.$accessor.user.me._id;
      const res =
        await this.$accessor.equipmentProposal.createEquipmentProposal(
          this.item
        );
      if (res) {
        this.snack.display(`Proposition envoyée`);
        this.changeProposalForm = false;
        form.reset();
      } else {
        this.snack.display(`Erreur lors de l'envoi de la proposition`);
      }
    },
    addNewBorrowedItems() {
      this.item.borrowed.push(this.newBorrow);
      this.newBorrow = {
        from: "",
        amount: "",
        start: "",
        end: "",
      };
    },
    deleteBorrowedProposal(item: any) {
      this.item.borrowed.splice(this.item.borrowed.indexOf(item), 1);
    },
    openDialog() {
      if (this.isNewEquipment) {
        this.item = {
          name: "",
          amount: "",
          location: "",
          type: "",
          comment: "",
          referencePicture: "",
          referenceInvoice: "",
          borrowed: [],
        };
      } else {
        this.item = _.cloneDeep(this.equipment);
      }
      Vue.nextTick(() => {
        this.changeProposalForm = true;
      });
    },
    closeDialog() {
      this.changeProposalForm = false;
      (this.$refs.proposalForm as HTMLFormElement).reset();
    },
  },
});
</script>

<style></style>

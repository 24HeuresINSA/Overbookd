<template>
  <div>
    <v-dialog
      v-model="isFormOpened"
      max-width="800"
      persistent
      scrollable
      @keydown.esc="closeDialog"
    >
      <v-card>
        <v-card-title>Ajouter un nouvel objet</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
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
                label="Vient du pool des assos ? 🐔"
              ></v-switch>
              <v-select
                v-model="item.location"
                :items="possibleLocations"
                label="Lieu de l'objet"
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
            <br />
            <v-divider></v-divider>
            <br />
            <h3>Ajout de matos emprunté</h3>
            <v-container style="display: flex; flex-wrap: wrap">
              <v-text-field v-model="newBorrow.from" label="Qui"></v-text-field>
              <v-text-field
                v-model="newBorrow.amount"
                type="number"
                label="Quantité"
              ></v-text-field>
            </v-container>
            <v-container
              style="
                display: flex;
                justify-content: space-around;
                align-content: baseline;
              "
            >
              <label>Début</label>
              <v-date-picker
                v-model="newBorrow.start"
                first-day-of-week="1"
              ></v-date-picker>
              <label>fin</label>
              <v-date-picker v-model="newBorrow.end"></v-date-picker>
            </v-container>

            <v-data-table :headers="borrowedHeader" :items="item.borrowed">
              <template #[`item.action`]="{ item }">
                <v-btn icon small @click="deleteBorrowed(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>

            <v-btn fab @click="addNewBorrowedItems"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addEquipment">Sauvegarder</v-btn>
          <v-btn color="error" text @click="closeDialog">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import { Snack } from "~/utils/models/snack";

export default Vue.extend({
  name: "EquipmentDialog",
  props: {
    isNewEquipment: { type: Boolean, required: true },
    equipment: { type: Object, required: true },
  },
  data() {
    return {
      isFormOpened: false,

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
      valid: false,
      newBorrow: {
        from: "",
        amount: 0,
        start: "",
        end: "",
      },
      borrowedHeader: [
        {
          text: "Qui",
          align: "left",
          value: "from",
        },
        {
          text: "Quantité",
          align: "left",
          value: "amount",
        },
        {
          text: "Début",
          align: "left",
          value: "start",
        },
        {
          text: "Fin",
          align: "left",
          value: "end",
        },
        {
          text: "",
          align: "right",
          value: "action",
        },
      ],
      item: {
        name: "",
        amount: 0,
        fromPool: false,
        location: "",
        preciseLocation: "",
        comment: "",
        referencePicture: "",
        referenceInvoice: "",
        type: "",
        borrowed: Array<any>(),
      },
      snack: new Snack(),
    };
  },
  computed: {
    possibleLocations() {
      return this.$accessor.location.locations.filter((e) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    sortedEquipmentTypes() {
      return [
        ...this.$accessor.config.getConfig("equipment_form")[1].options,
      ].sort();
    },
  },
  methods: {
    async addEquipment() {
      const form = this.$refs.form as HTMLFormElement;
      form.validate();
      if (!this.valid) return;
      if (this.isNewEquipment) {
        const res = await this.$accessor.equipment.set(this.item);
        if (res) {
          this.snack.display("Ajout réussi");
        } else {
          this.snack.display("Erreur lors de l'ajout");
        }
      } else {
        const res = await this.$accessor.equipment.update(this.item);
        if (res) {
          this.snack.display("Mise à jour réussie");
        } else {
          this.snack.display("Erreur lors de la mise à jour");
        }
      }
      this.isFormOpened = false;
      form.reset();
    },
    addNewBorrowedItems() {
      if (this.item.borrowed) this.item.borrowed.push(this.newBorrow);
      else this.item.borrowed = [this.newBorrow];
      this.newBorrow = {
        from: "",
        amount: 0,
        start: "",
        end: "",
      };
    },
    deleteBorrowedProposal(item: any) {
      this.item.borrowed.splice(this.item.borrowed.indexOf(item), 1);
    },
    openDialog() {
      this.item = _.cloneDeep(this.equipment);
      this.isFormOpened = true;
    },
    closeDialog() {
      (this.$refs.form as HTMLFormElement).reset();
      this.isFormOpened = false;
    },
    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },
  },
});
</script>

<style></style>

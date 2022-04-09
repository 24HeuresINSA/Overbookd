<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="80%"
      scrollable
      @keydown.esc="closeDialog"
    >
      <v-card>
        <v-card-title>
          <span class="headline"
            >Proposition de {{ byUser.nickname || byUser.firstname }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-alert v-if="mEquipmentProposal.isNewEquipment" color="blue-grey">
            <v-icon>mdi-alert-circle-outline</v-icon>
            {{ message }}
          </v-alert>
          <v-container>
            <v-row>
              <v-col v-if="oldEquipment" cols="12" sm="6">
                EQUIPEMENT ACTUEL
                <v-text-field
                  v-model="oldEquipment.name"
                  label="Name"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.type"
                  label="Catégorie/type"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.amount"
                  label="quantité"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.location"
                  label="Lieux"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.preciseLocation"
                  label="Emplacement Précis"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.comment"
                  label="Commentaire"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.referencePicture"
                  label="Référence photo"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="oldEquipment.referenceInvoice"
                  label="Référence facture"
                  readonly
                ></v-text-field>
                <v-divider></v-divider>
                <v-simple-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th>Qui</th>
                        <th>Quantité</th>
                        <th>Debut</th>
                        <th>Fin</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(borrowed, index) in oldEquipment.borrowed"
                        :key="index"
                      >
                        <td>{{ borrowed.from }}</td>
                        <td>{{ borrowed.amount }}</td>
                        <td>{{ borrowed.start }}</td>
                        <td>{{ borrowed.end }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" sm="6">
                NOUVELLE PROPOSITION
                <v-text-field
                  v-model="mEquipmentProposal.name"
                  label="Name"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.name !== mEquipmentProposal.name
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.type"
                  label="Catégorie/type"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.type !== mEquipmentProposal.type
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.amount"
                  label="quantité"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.amount !== mEquipmentProposal.amount
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.location"
                  label="Lieux"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.location !== mEquipmentProposal.location
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.preciseLocation"
                  label="Emplacement Précis"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.preciseLocation !==
                        mEquipmentProposal.preciseLocation
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.comment"
                  label="Commentaire"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.comment !== mEquipmentProposal.comment
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.referencePicture"
                  label="Référence photo"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.referencePicture !==
                        mEquipmentProposal.referencePicture
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="mEquipmentProposal.referenceInvoice"
                  label="Référence facture"
                  readonly
                >
                  <template
                    v-if="
                      oldEquipment &&
                      oldEquipment.referenceInvoice !==
                        mEquipmentProposal.referenceInvoice
                    "
                    #prepend
                  >
                    <v-icon color="error">mdi-brightness-1</v-icon>
                  </template>
                </v-text-field>
                <v-divider></v-divider>
                <v-simple-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th>Qui</th>
                        <th>Quantité</th>
                        <th>Debut</th>
                        <th>Fin</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(borrowed, index) in mEquipmentProposal.borrowed"
                        :key="index"
                      >
                        <td>{{ borrowed.from }}</td>
                        <td>{{ borrowed.amount }}</td>
                        <td>{{ borrowed.start }}</td>
                        <td>{{ borrowed.end }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Annuler</v-btn
          >
          <v-btn color="error" @click="refuse">Refuser</v-btn>
          <v-btn color="primary" @click="confirm">Accepter</v-btn>
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
import { Equipment, EquipmentProposal } from "~/utils/models/Equipment";
import { User } from "~/utils/models/repo";

export default Vue.extend({
  name: "EquipmentProposalValidationDialog",
  props: {
    equipmentProposal: {
      type: Object as () => EquipmentProposal,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      message: "C'est un nouvel equipement",
      snack: new Snack(),
    };
  },
  computed: {
    oldEquipment(): Equipment | undefined {
      if (!this.mEquipmentProposal.isNewEquipment) {
        return this.$accessor.equipment.items.find(
          (item: any) => item._id === this.equipmentProposal.oldEquipment
        );
      } else {
        return undefined;
      }
    },
    mEquipmentProposal(): EquipmentProposal {
      return _.cloneDeep(this.equipmentProposal);
    },
    byUser(): User {
      return this.$accessor.user.mUser;
    },
  },
  methods: {
    async openDialog() {
      await Vue.nextTick();
      this.$accessor.user.findUserById(this.equipmentProposal.byUser);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async confirm() {
      const res =
        await this.$accessor.equipmentProposal.validateEquipmentProposal(
          this.mEquipmentProposal
        );
      if (res) {
        this.snack.display("L'équipement a bien été accepté");
      } else {
        this.snack.display("Une erreur est survenue");
      }
      this.closeDialog();
    },
    async refuse() {
      const res =
        await this.$accessor.equipmentProposal.refuseEquipmentProposal(
          this.mEquipmentProposal
        );
      if (res) {
        console.log("res");
        this.snack.display("L'équipement a bien été refusé");
      } else {
        this.snack.display("Une erreur est survenue");
      }
      this.closeDialog();
    },
  },
});
</script>

<style></style>

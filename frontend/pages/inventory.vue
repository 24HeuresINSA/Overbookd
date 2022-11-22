<template>
  <div>
    <EquipmentProposalDialogPage
      ref="equipPropPage"
    ></EquipmentProposalDialogPage>

    <v-container>
      <v-row>
        <v-col md="3">
          <v-card>
            <v-card-title>
              <span class="headline">Filtres</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search.name"
                label="Nom / type / commentaire"
                append-icon="mdi-search"
                single-line
                hide-details
              ></v-text-field>

              <v-switch
                v-model="search.fromPool"
                label="Poule 🐔"
                hide-details
              ></v-switch>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="clear">Réinitialiser</v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <template v-if="hasRole(['log', 'admin'])">
            <v-card>
              <v-card-title>
                <span class="headline">Export</span>
              </v-card-title>
              <v-card-text>
                <v-btn text @click="exportCSV">Exporter l'inventaire</v-btn>
              </v-card-text>
            </v-card>
            <br />
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Lieux</span>
            </v-card-title>
            <v-card-text>
              <location-adder ref="locationAdder"></location-adder>
              <v-chip-group
                v-model="search.location"
                column
                multiple
                active-class="primary--text"
              >
                <v-chip
                  v-for="location in possibleLocations"
                  :key="location._id"
                  :value="location.name"
                  >{{ location.name }}</v-chip
                >
              </v-chip-group>
              <v-chip-group class="mt-3" column multiple>
                <v-chip
                  v-for="location in signaLocations"
                  :key="location._id"
                  :value="location.name"
                  disabled
                  >{{ location.name }}</v-chip
                >
              </v-chip-group>
            </v-card-text>
            <v-card-actions v-if="hasRole(['log'])">
              <v-btn
                color="primary"
                text
                @click="$refs.locationAdder.openDialog()"
                >Ajouter</v-btn
              >
              <!-- <v-btn color="primary" text @click="tryDeleteLocation()"
                >Supprimer</v-btn
              > -->
            </v-card-actions>
          </v-card>
          <br />
          <v-card v-if="hasRole('log')">
            <v-card-title> Propososition d'équipement </v-card-title>
            <v-card-subtitle
              >Nombre de propositions :
              <b>{{ nbProposals }}</b></v-card-subtitle
            >
            <v-card-text>
              <v-btn @click="openProposalPage()"> Voir les propositions </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="filteredInventory"
            group-by="type"
            :item-class="rowClass"
            dense
            :items-per-page="20"
            :loading="loading"
          >
            <template #[`item.action`]="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon small @click="showItemInfos(item)" v-on="on">
                    <v-icon small>mdi-help-circle</v-icon>
                  </v-btn>
                </template>
                Afficher les informations de l'objet
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon small @click="itemChangeProposal(item)" v-on="on">
                    <v-icon small>mdi-book-edit-outline </v-icon>
                  </v-btn>
                </template>
                Propose des changements sur l'objet (et voit ses infos)
              </v-tooltip>
              <v-btn v-if="hasRole('log')" icon small @click="edit(item)">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn v-if="hasRole('log')" icon small @click="deleteItem(item)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>

            <template #[`item.borrow`]="{ item }">
              <!-- Divs get better style, and list not that needed -->
              <div v-for="(borrow, index) of item.borrowed" :key="index">
                {{ borrow.amount }} {{ borrow.from }}
              </div>
            </template>
            <template #[`group.header`]="{ group, headers, toggle, isOpen }">
              <td :colspan="headers.length" class="primary">
                <v-btn
                  :ref="group"
                  small
                  icon
                  :data-open="isOpen"
                  @click="toggle"
                >
                  <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
                <span class="mx-5 font-weight-bold">{{ group }}</span>
              </td>
            </template>
            <template #[`item.borrowedCount`]="{ item }">
              {{ getBorrowedCount(item) }}
            </template>

            <template #[`item.totalCount`]="{ item }">
              {{ +getBorrowedCount(item) + +item.amount }}
            </template>
            <template #[`item.fromPool`]="{ item }">
              <span v-if="item.fromPool"> 🐔 </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      v-if="hasRole(allowedTeams)"
      fab
      style="right: 20px; bottom: 45px; position: fixed"
      @click="newEquip"
    >
      <v-icon> mdi-plus </v-icon>
    </v-btn>
    <v-btn
      fab
      style="right: 80px; bottom: 45px; position: fixed"
      @click="newProposal"
    >
      <v-icon>mdi-clipboard-edit-outline</v-icon>
    </v-btn>

    <EquipmentProposalDialog
      ref="propDialog"
      :equipment="selectedItem"
      :is-new-equipment="isNewEquipment"
    ></EquipmentProposalDialog>

    <EquipmentDialog
      ref="equipDialog"
      :equipment="selectedItem"
      :is-new-equipment="isNewEquipment"
    ></EquipmentDialog>
    <v-dialog v-model="isPreciseLocDialog" max-width="800">
      <v-card>
        <v-card-title>Emplacement précis</v-card-title>
        <v-card-text v-if="selectedItem.preciseLocation">
          <b>{{ selectedItem.preciseLocation }}</b>
        </v-card-text>
        <v-alert v-else color="error">
          Aucun emplacement précis n'a été défini
        </v-alert>
      </v-card>
    </v-dialog>
    <EquipmentInformations
      ref="equipmentInformationsDialog"
      :equipment="selectedItem"
    ></EquipmentInformations>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import locationAdder from "../components/organisms/locationAdder.vue";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import Vue from "vue";
import EquipmentInformations from "~/components/organisms/equipment/EquipmentInformations.vue";
import EquipmentProposalDialog from "~/components/organisms/equipment/EquipmentProposalDialog.vue";
import EquipmentProposalDialogPage from "~/components/organisms/equipment/EquipmentProposalDialogPage.vue";
import EquipmentDialog from "~/components/organisms/equipment/EquipmentDialog.vue";
import Fuse from "fuse.js";
import { location, User } from "~/utils/models/repo";
import { Equipment } from "~/utils/models/Equipment";
import { Snack } from "~/utils/models/snack";
import { Header } from "~/utils/models/Data";

interface Data {
  headers: Header[];
  borrowedHeader: Header[];

  borrowed: Equipment[];
  isFormOpened: boolean;
  changeProposalForm: boolean;
  allowedTeams: string[];
  selectedItem: Equipment;
  search: Search;
  selectOptions: string[];

  newLocation: string;
  isPreciseLocDialog: boolean;
  valid: boolean;

  isNewEquipment: boolean;
  loading: boolean;
  snack: Snack;
  showDeleted: boolean;
}

interface Search {
  name: string;
  location: string;
  locationSigna: string;
  type: string;
  fromPool: boolean;
}

export default Vue.extend({
  name: "Inventory",
  components: {
    locationAdder,
    EquipmentInformations,
    EquipmentProposalDialog,
    EquipmentProposalDialogPage,
    EquipmentDialog,
  },
  data(): Data {
    return {
      headers: [
        { text: "Nom", value: "name" },
        { text: "Lieu de stockage", value: "location" },
        { text: "Quantité (inventaire 24)", value: "amount", align: "right" },
        { text: "Quantité (emprunté)", value: "borrowedCount", align: "right" },
        { text: "Emprunté", value: "borrow" },
        { text: "Poule", value: "fromPool" },
        { text: "Quantité total", value: "totalCount", align: "right" },
        { text: "Requis", value: "required.count", align: "right" },
        { text: "Action", value: "action", align: "right" },
      ],
      borrowedHeader: [
        { text: "qui", value: "from" },
        { text: "quantite", value: "amount" },
        { text: "debut", value: "start" },
        { text: "fin", value: "end" },
        { text: "action", value: "action" },
      ],
      borrowed: Array<any>(),
      isFormOpened: false,
      changeProposalForm: false,
      allowedTeams: ["log"],
      selectedItem: {} as Equipment,
      search: {
        name: "",
        location: "",
        locationSigna: "",
        type: "",
        fromPool: false,
      },
      selectOptions: [],
      newLocation: "",
      isPreciseLocDialog: false,
      valid: false,

      isNewEquipment: false,
      loading: false,
      snack: new Snack(),
      showDeleted: false,
    };
  },

  computed: {
    me(): User {
      return this.$store.state.user.me;
    },
    filteredInventory(): Equipment[] {
      const fuse = new Fuse(this.inventory, {
        keys: ["name", "type", "comment"],
        threshold: 0.3,
      });
      let res = fuse.search(this.search.name).map((item) => {
        return item.item;
      }) as Equipment[];
      res = res.length === 0 ? this.inventory : res;
      if (this.search.location.length > 0) {
        res = res.filter((i: any) => {
          return this.search.location.includes(i.location);
        });
      }
      if (this.search.fromPool) {
        res = res.filter((i: any) => {
          return i.fromPool;
        });
      }
      return res;
    },
    possibleLocations(): location[] {
      return this.$accessor.location.locations.filter((e: any) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    signaLocations(): location[] {
      return this.$accessor.location.signa;
    },
    equipmentForm(): any {
      return this.getConfig("equipment_form");
    },
    inventory(): Equipment[] {
      return cloneDeep(this.$accessor.equipment.items).filter(
        (e: Equipment) => {
          return !(e.isValid === false);
        }
      );
    },
    nbProposals(): number {
      return this.$accessor.equipmentProposal.count;
    },
    equipmentMap(): Map<String, number> {
      const faEquipmentMap = this.$accessor.FA.equipmentMap;
      const ftEquipmentMap = this.$accessor.FT.equipmentMap;
      return new Map([...faEquipmentMap, ...ftEquipmentMap]);
    },
  },

  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
      // setup config
      this.loading = true;
      let res = await this.$accessor.location.getAllLocations();
      if (!res) {
        this.snack.display("Erreur lors du chargement des localisations");
      }
      this.allowedTeams = (await this.getConfig("isInventoryOpen"))
        ? ["log", "hard"]
        : ["log"];
      this.selectOptions = this.equipmentForm[1].options;
      const equipRes = await this.$accessor.equipment.fetchAll();
      if (!equipRes) {
        this.snack.display("Erreur lors du chargement des équipements");
      }
      const resFA = await this.$accessor.FA.fetchAll();
      const resFT = await this.$accessor.FT.fetchAll();
      if (!resFA || !resFT) {
        this.snack.display("Erreur lors du chargement des équipements");
      }

      this.inventory.forEach((item: any) => {
        item.required = {
          count: 0,
          form: Array<any>(),
        };
        if (item._id && this.equipmentMap.has(item._id)) {
          item.required.count = this.equipmentMap.get(item._id);
        }
      });
      const propRes =
        await this.$accessor.equipmentProposal.getEquipmentProposal();
      if (!propRes) {
        this.snack.display(
          "Erreur lors la récupération des équipements proposés"
        );
      }
      this.loading = false;
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    rowClass(item: Equipment): any {
      if (item.required) {
        let isNegatif =
          item.required.count > +this.getBorrowedCount(item) + +item.amount;
        return isNegatif ? "color: red" : "";
      }
    },

    hasRole(role: string | string[]): boolean {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },

    openDialog() {
      this.selectedItem = {
        name: "",
        type: "",
        comment: "",
        location: "",
        fromPool: false,
        amount: 0,
      };
      this.isFormOpened = true;
    },

    openProposalPage() {
      (this.$refs.equipPropPage as any).openDialog();
    },
    getBorrowedCount(item: Equipment): number {
      let count = 0;
      if (item && item.borrowed) {
        if (item.borrowed.length) {
          item.borrowed.forEach((b) => {
            if (b.amount) {
              count = count + +b.amount;
            }
          });
        }
      }
      return count;
    },

    edit(item: Equipment) {
      this.selectedItem = item;
      Vue.nextTick(() => {
        (this.$refs.equipDialog as any).openDialog();
      });
    },
    async itemChangeProposal(item: Equipment) {
      this.selectedItem = item;
      this.isNewEquipment = false;
      await Vue.nextTick();
      (this.$refs.propDialog as any).openDialog();
    },
    newEquip() {
      this.selectedItem = {
        name: "",
        type: "",
        comment: "",
        location: "",
        fromPool: false,
        amount: 0,
      };
      this.isNewEquipment = true;
      Vue.nextTick(() => {
        (this.$refs.equipDialog as any).openDialog();
      });
    },
    newProposal() {
      this.selectedItem = {
        name: "",
        type: "",
        comment: "",
        location: "",
        fromPool: false,
        amount: 0,
      };
      this.isNewEquipment = true;
      Vue.nextTick(() => {
        (this.$refs.propDialog as any).openDialog();
      });
    },
    async deleteItem(item: Equipment) {
      if (item.required && item.required.count > 0) {
        //TODO: Create this snackbar/toast for global use
        this.$store.commit("setSnackbar", {
          text: "Impossible de supprimer un équipement qui est requis",
          color: "error",
        });
        return;
      }
      this.$accessor.equipment.delete(item);
    },
    clear() {
      this.search = {
        name: "",
        location: "",
        locationSigna: "",
        type: "",
        fromPool: false,
      };
    },
    async tryDeleteLocation() {
      const index = this.equipmentForm.findIndex(
        (e: any) => e.key === "location"
      );
      //TODO add a notification to know why you can't delete
      if (
        this.inventory.some((e: Equipment) =>
          this.search.location.includes(e.location)
        )
      )
        return;
      const newEquipmentForm = cloneDeep(this.equipmentForm);
      newEquipmentForm[index].options = newEquipmentForm[index].options.filter(
        (e: string) => !this.search.location.includes(e)
      );
      this.$store.dispatch("config/setConfig", {
        key: "equipment_form",
        value: newEquipmentForm,
      });
      this.$forceUpdate();
    },
    async showItemInfos(item: Equipment) {
      this.selectedItem = item;
      await Vue.nextTick();
      (this.$refs.equipmentInformationsDialog as any).openDialog();
    },
    async deleteBorrowed(item: Equipment) {
      if (!this.selectedItem.borrowed) return;
      const index = this.selectedItem.borrowed.findIndex((e: any) =>
        isEqual(e, item)
      );
      this.selectedItem.borrowed.splice(index, 1);
    },
    download(filename: string, text: string) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      let csv =
        "Type;Nom;Lieu de stockage;Quantité (inventaire 24);Quantité (emprunté);Est au pool des assos;Quantité total;Quantité requises \n";
      const iventaire = this.filteredInventory;
      iventaire.forEach((element) => {
        csv +=
          element.type +
          ";" +
          element.name +
          ";" +
          element.location +
          ";" +
          element.amount +
          ";" +
          this.getBorrowedCount(element) +
          ";" +
          element.fromPool +
          ";" +
          (this.getBorrowedCount(element) + element.amount) +
          ";" +
          (element.required ? element.required.count : "undefined") +
          "\n";
      });

      const regex = new RegExp(/undefined/i, "g");

      let parsedCSV = csv.replaceAll(regex, "");
      // Prompt the browser to start file download
      this.download("inventaire.csv", parsedCSV);
    },
  },
});
</script>

<style scoped></style>

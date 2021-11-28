<template>
  <div>
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
                label="Nom de l'objet"
                append-icon="mdi-search"
                single-line
                hide-details
              ></v-text-field>
              <v-select
                v-model="search.type"
                :items="selectOptions"
                label="Catégorie/type"
                append-icon=""
                single-line
                hide-details
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="clear"> Clear </v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <v-card>
            <v-card-title>
              <span class="headline">Lieux</span>
            </v-card-title>
            <v-card-text>
              <v-chip-group
                v-model="search.location"
                column
                multiple
                active-class="primary--text"
              >
                <v-chip
                  v-for="location in possibleLocations"
                  :key="location"
                  :value="location"
                  >{{ location }}</v-chip
                >
              </v-chip-group>
              <v-text-field
                v-model="newLocation"
                label="Nouveau lieu"
                append-icon="mdi-search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-text>
            <v-card-actions v-if="hasRole('log')">
              <v-btn color="primary" text @click="pushNewLocation(newLocation)"
                >Ajouter</v-btn
              >
              <v-btn color="primary" text @click="tryDeleteLocation()"
                >Supprimer</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="filteredInventory"
            group-by="type"
            :item-class="rowClass"
            dense
          >
            <template #[`item.action`]="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon small @click="showPreciseLoc(item)" v-on="on">
                    <v-icon small>mdi-help-circle</v-icon>
                  </v-btn>
                </template>
                Afficher l'emplacement précis
              </v-tooltip>
              <v-btn v-if="hasRole('log')" icon small @click="edit(item)">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn v-if="hasRole('log')" icon small @click="deleteItem(item)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>

            <template #[`item.borrow`]="{ item }">
              <v-list dense>
                <v-list-item
                  v-for="(borrow, index) of item.borrowed"
                  :key="index"
                >
                  <v-list-item-content>
                    <v-list-item-title style="padding: 0">
                      {{ borrow.amount }} {{ borrow.from }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>
            <template #group.header="{ group, headers, toggle, isOpen }">
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
      @click="openDialog()"
    >
      <v-icon> mdi-plus </v-icon>
    </v-btn>

    <v-dialog v-model="isFormOpened" max-width="800" persistent>
      <v-card>
        <v-card-title>Ajouter un nouveau objet</v-card-title>
        <v-card-text>
          <v-btn color="primary" text @click="addEquipment">Sauvegarder</v-btn>
          <v-btn color="error" text @click="isFormOpened = false">
            Annuler
          </v-btn>

          <OverForm
            :fields="equipmentForm"
            :data="selectedItem"
            @form-change="onFormChange"
          >
          </OverForm>
          <br />
          <v-divider></v-divider>
          <br />
          <h4>Ajout de matos emprunté</h4>
          <v-container style="display: flex; flex-wrap: wrap">
            <v-text-field v-model="newBorrow.from" label="qui"></v-text-field>
            <v-text-field
              v-model="newBorrow.amount"
              type="number"
              label="quantite"
            ></v-text-field>
          </v-container>
          <v-container
            style="
              display: flex;
              justify-content: space-around;
              align-content: baseline;
            "
          >
            <label>debut</label>
            <v-date-picker v-model="newBorrow.start"></v-date-picker>
            <label>fin</label>
            <v-date-picker v-model="newBorrow.end"></v-date-picker>
          </v-container>

          <v-data-table :headers="borrowedHeader" :items="borrowed">
            <template #[`item.action`]="{ item }">
              <v-btn icon small @click="deleteBorrowed(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-btn fab @click="addNewBorrowedItems"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addEquipment">
            Sauvegarder
          </v-btn>
          <v-btn color="error" text @click="isFormOpened = false">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import OverForm from "../components/overForm";
import { safeCall } from "../utils/api/calls";
import { RepoFactory } from "../repositories/repoFactory";
import { cloneDeep, isEqual } from "lodash";
import Vue from "vue";

export default {
  name: "Inventory",
  components: { OverForm },
  data() {
    return {
      inventory: [],
      headers: [
        { text: "nom", value: "name" },
        { text: "lieu de stockage", value: "location" },
        { text: "quantite (inventaire 24)", value: "amount", align: "right" },
        { text: "quantite (emprunté)", value: "borrowedCount", align: "right" },
        { text: "emprunté", value: "borrow" },
        { text: "Poule", value: "fromPool" },
        { text: "quantite total", value: "totalCount", align: "right" },
        { text: "requis", value: "required.count", align: "right" },
        { text: "action", value: "action", align: "right" },
      ],
      borrowedHeader: [
        { text: "qui", value: "from" },
        { text: "quantite", value: "amount" },
        { text: "debut", value: "start" },
        { text: "fin", value: "end" },
        { text: "action", value: "action" },
      ],
      borrowed: [],
      isFormOpened: false,
      allowedTeams: ["log"],
      selectedItem: {},
      newBorrow: {
        start: undefined,
        end: undefined,
        from: undefined,
        amount: undefined,
      },
      search: {
        name: "",
        location: [],
        type: "",
      },
      selectOptions: [],
      newLocation: "",
      isPreciseLocDialog: false,
    };
  },

  computed: {
    me: () => this.$store.state.user.me,
    filteredInventory() {
      console.log(this.search.location);
      return this.inventory.filter((item) => {
        return (
          item.name.toLowerCase().includes(this.search.name.toLowerCase()) &&
          (this.search.location.length === 0 ||
            this.search.location.includes(item.location)) &&
          item.type.toLowerCase().includes(this.search.type.toLowerCase())
        );
      });
    },
    possibleLocations() {
      return this.getConfig("equipment_form").filter((item) => {
        return item.key === "location";
      })[0].options;
    },
    equipmentForm() {
      return this.getConfig("equipment_form");
    },
  },

  async mounted() {
    // setup config
    this.allowedTeams = (await this.getConfig(this, "isInventoryOpen"))
      ? ["log", "hard"]
      : ["log"];
    this.selectOptions = this.equipmentForm[1].options;
    this.inventory = (await this.$axios.$get("/equipment")).filter(
      (e) => e.isValid !== false
    );
    const FTs = await safeCall(this.$store, RepoFactory.ftRepo.getAllFTs(this));
    const FAs = await safeCall(this.$store, RepoFactory.faRepo.getAllFAs(this));

    const Form = FAs.data.concat(FTs.data);

    this.inventory.forEach((item) => {
      item.required = {
        count: 0,
        form: [],
      };
      Form.forEach((form) => {
        if (form.equipments && form.isValid !== false) {
          const mEquipment = form.equipments.find((e) => e._id === item._id);
          if (mEquipment) {
            item.required.count += mEquipment.required;
            item.required.form.push(form);
          }
        }
      });
    });
  },

  methods: {
    rowClass(item) {
      if (item.required) {
        let isNegatif =
          item.required.count > +this.getBorrowedCount(item) + +item.amount;
        return isNegatif ? "color: red" : "";
      }
    },

    async hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    onFormChange(form) {
      console.log(form);
      // because it doesn't work ...
      form.isValid = true;
      Object.assign(this.selectedItem, form);
    },

    openDialog() {
      this.selectedItem = {};
      this.isFormOpened = true;
    },

    async addEquipment() {
      this.selectedItem.borrowed = this.borrowed;
      delete this.selectedItem._id;
      this.selectedItem = (
        await this.$axios.put("/equipment", this.selectedItem)
      ).data;
      if (
        this.inventory.findIndex((e) => e._id === this.selectedItem._id) === -1
      ) {
        this.inventory.push(this.selectedItem);
      }
      this.isFormOpened = false;
      this.selectedItem = {};
      this.borrowed = [];
    },

    addNewBorrowedItems() {
      this.borrowed.push({ ...this.newBorrow });
    },

    getBorrowedCount(item) {
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

    edit(item) {
      console.log(item);
      this.borrowed = item.borrowed;
      this.selectedItem = item;
      this.isFormOpened = true;
    },

    async deleteItem(item) {
      if (item.required.count > 0) {
        //TODO: Create this snackbar/toast for global use
        this.$store.commit("setSnackbar", {
          text: "Impossible de supprimer un équipement qui est requis",
          color: "error",
        });
        return;
      }
      item.isValid = false;
      await this.$axios.put("/equipment", item);
      this.inventory = this.inventory.filter((i) => i._id !== item._id);
    },
    clear() {
      this.search = {
        name: "",
        location: "",
        type: "",
      };
    },
    async pushNewLocation(location) {
      if (!location) return;
      const index = this.equipmentForm.findIndex((e) => e.key === "location");
      if (this.equipmentForm[index].options.includes(location)) return;
      const newEquipmentForm = cloneDeep(this.equipmentForm);
      newEquipmentForm[index].options.push(location);
      this.$store.dispatch("config/setConfig", {
        key: "equipment_form",
        value: newEquipmentForm,
      });
      this.$forceUpdate();
    },
    async tryDeleteLocation() {
      const index = this.equipmentForm.findIndex((e) => e.key === "location");
      //TODO add a notification to know why you can't delete
      if (this.inventory.some((e) => this.search.location.includes(e.location)))
        return;
      const newEquipmentForm = cloneDeep(this.equipmentForm);
      newEquipmentForm[index].options = newEquipmentForm[index].options.filter(
        (e) => !this.search.location.includes(e)
      );
      this.$store.dispatch("config/setConfig", {
        key: "equipment_form",
        value: newEquipmentForm,
      });
      this.$forceUpdate();
    },
    async showPreciseLoc(item) {
      this.selectedItem = item;
      this.isPreciseLocDialog = true;
    },
    async deleteBorrowed(item) {
      const index = this.selectedItem.borrowed.findIndex((e) =>
        isEqual(e, item)
      );
      this.selectedItem.borrowed.splice(index, 1);
      await this.$axios.put("/equipment", this.selectedItem);
    },
  },
};
</script>

<style scoped>
.v-list-item {
  padding: 0;
}

.v-list-item__content {
  padding: 0;
}
</style>

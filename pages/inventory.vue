<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="inventory"
      group-by="type"
      :item-class="rowClass"
      dense
    >
      <template #[`item.action`]="{ item }">
        <v-btn v-if="hasRole('log')" icon small @click="edit(item)">
          <v-icon small>mdi-circle-edit-outline</v-icon>
        </v-btn>
        <v-btn v-if="hasRole('log')" icon small @click="deleteItem(item)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #[`item.borrow`]="{ item }">
        <v-list dense>
          <v-list-item v-for="(borrow, index) of item.borrowed" :key="index">
            <v-list-item-content>
              <v-list-item-title style="padding: 0">
                {{ borrow.amount }} {{ borrow.from }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>

      <template #[`item.borrowedCount`]="{ item }">
        {{ getBorrowedCount(item) }}
      </template>

      <template #[`item.totalCount`]="{ item }">
        {{ +getBorrowedCount(item) + +item.amount }}
      </template>
    </v-data-table>

    <v-btn
      v-if="hasRole(allowedTeams)"
      fab
      style="right: 20px; bottom: 45px; position: fixed"
      @click="openDialog()"
    >
      <v-icon> mdi-plus </v-icon>
    </v-btn>

    <v-dialog v-model="isFormOpened" max-width="800">
      <v-card>
        <v-card-title>Ajouter un nouveau objet</v-card-title>
        <v-card-text>
          <v-btn color="primary" text @click="addEquipment"> Ajouter</v-btn>

          <OverForm
            :fields="equipmentForm"
            :data="selectedItem"
            @form-change="onFormChange"
          >
          </OverForm>
          <v-divider></v-divider>
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
          </v-data-table>

          <v-btn fab @click="addNewBorrowedItems"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addEquipment"> Ajouter </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OverForm from "../components/overForm";
import { safeCall } from "../utils/api/calls";
import { RepoFactory } from "../repositories/repoFactory";

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
        { text: "quantite total", value: "totalCount", align: "right" },
        { text: "requit", value: "required.count", align: "right" },
        { text: "action", value: "action", align: "right" },
      ],
      borrowedHeader: [
        { text: "qui", value: "from" },
        { text: "quantite", value: "amount" },
        { text: "debut", value: "start" },
        { text: "fin", value: "end" },
      ],
      borrowed: [],
      isFormOpened: false,
      allowedTeams: ["log"],
      equipmentForm: [],
      selectedItem: {},
      newBorrow: {
        start: undefined,
        end: undefined,
        from: undefined,
        amount: undefined,
      },
    };
  },

  computed: {
    me: () => this.$store.state.user.me,
  },

  async mounted() {
    // setup config
    this.allowedTeams = (await this.getConfig(this, "isInventoryOpen"))
      ? ["log", "hard"]
      : ["log"];
    this.equipmentForm = await this.getConfig("equipment_form");

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
      Object.assign(this.selectedItem, form);
    },

    openDialog() {
      this.selectedItem = {};
      this.isFormOpened = true;
    },

    async addEquipment() {
      this.selectedItem.borrowed = this.borrowed;
      delete this.selectedItem._id;
      this.selectedItem = await this.$axios.put(
        "/equipment",
        this.selectedItem
      );
      this.inventory.push(this.selectedItem);
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
      item.isValid = false;
      await this.$axios.put("/equipment", item);
      this.inventory = this.inventory.filter((i) => i._id !== item._id);
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

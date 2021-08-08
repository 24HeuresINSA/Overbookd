<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="inventory"
    >
      <template v-slot:item.action="{ item }">
        <v-btn v-if="hasRole('log')" fab @click="edit(item)"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
        </template>

      <template v-slot:item.borrowedCount="{ item }">
        {{getBorrowedCount(item)}}
      </template>

    </v-data-table>

    <v-btn
      fab
      style="right: 20px; bottom: 45px; position:fixed;"
      @click="isFormOpened = true"
      v-if="hasRole(allowedTeams)"
    >
      <v-icon>
        mdi-plus
      </v-icon>
    </v-btn>

    <v-dialog
      v-model="isFormOpened"
      max-width="800"
    >
      <v-card>
        <v-card-title>Ajouter un nouveau objet</v-card-title>
        <v-card-text>
          <over-form
              :fields="equipmentForm"
              @form-change="onFormChange"
          >
          </over-form>
          <v-divider></v-divider>
          <v-container style="display: flex; flex-wrap: wrap">
            <v-text-field label="qui" v-model="newBorrow.from"></v-text-field>
            <v-text-field type="number" v-model="newBorrow.amount" label="quantite"></v-text-field>
          </v-container>
            <v-container style="display: flex; justify-content: space-around; align-content: baseline">
              <label>debut</label>
            <v-date-picker v-model="newBorrow.start"></v-date-picker>
              <label>fin</label>
              <v-date-picker v-model="newBorrow.end"></v-date-picker>
          </v-container>

          <v-data-table
              :headers="borrowedHeader"
              :items="borrowed"
          >
          </v-data-table>

          <v-btn fab @click="addNewBorrowedItems"><v-icon>mdi-plus</v-icon></v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="addEquipment"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
import OverForm from "../components/overForm";
import {getConfig, hasRole} from "../common/role";

export default {
  name: "inventory",
  components: {OverForm},
  data(){
    return {
      inventory: [],
      headers: [
        {text: 'nom', value: 'name'},
        {text: 'quantite (inventaire 24)', value: 'amount'},
        {text: 'quantite (emprunté)', value: 'borrowedCount'},
        {text: 'lieu de stockage', value: 'location'},
        {text: 'action', value: 'action'},

      ],
      borrowedHeader: [
        {text: 'qui', value: 'from'},
        {text: 'quantite', value: 'amount'},
        {text: 'debut', value: 'start'},
        {text: 'fin', value: 'end'},
      ],
      borrowed: [],
      isFormOpened: false,
      allowedTeams: getConfig(this, 'isInventoryOpen') ? ['log', 'hard'] : ['log'],
      equipmentForm: this.getConfig('equipment_form'),
      newEquipment: undefined,
      newBorrow: {
        start: undefined,
        end: undefined,
        from: undefined,
        amount: undefined
      }
    }
  },

  async mounted() {
    this.inventory = await this.$axios.$get('/equipment');
  },

  methods: {
    getUser(){
      return this.$store.state.user.data
    },

    hasRole(role){
      hasRole(this, role)
    },

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    onFormChange(form){
      this.newEquipment = form
    },

    async addEquipment(){
      this.newEquipment.borrowed = this.borrowed;
      this.newEquipment = await this.$axios.put('/equipment', this.newEquipment);
      this.isFormOpened = false;
      this.borrowed = [];
    },

    addNewBorrowedItems(){
      this.borrowed.push({...this.newBorrow});
    },

    getBorrowedCount(item){
      let count = 0;
      if(item && item.borrowed){
        if(item.borrowed.length){
          item.borrowed.forEach(b => {
            if(b.amount){
              count = count + +b.amount
            }
          })
        }
      }
      return count
    },

    edit(item){
      this.isFormOpened = true;
      this.borrowed = item.borrowed;
      Object.keys(item).forEach(key => {
        let mField = this.equipmentForm.find(e => e.key === key);
        if(mField){
          mField.value = item[key];
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
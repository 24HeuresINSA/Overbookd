<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="inventory"
    >
    </v-data-table>

    <v-btn
      fab
      style="right: 20px; bottom: 45px; position:fixed;"
      @click="isFormOpened = true"
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
      </v-card>
      <v-card-text>
        <over-form
            :fields="equipmentForm"
            @form-change="onFormChange"
        >
        </over-form>
      </v-card-text>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          text
          @click="dialog = false"
      >
        Ajouter
      </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>

<script>
import OverForm from "../components/overForm";

export default {
  name: "inventory",
  components: {OverForm},
  data(){
    return {
      inventory: [],
      headers: [
        {text: 'nom', value: 'name'},
        {text: 'longeur', value: 'length'},
        {text: 'largeur', value: 'width'},
        {text: 'hauteur', value: 'height'},
        {text: 'quantite', value: 'amount'},
      ],
      isFormOpened: false,
      equipmentForm: this.getConfig('equipment_form'),
      newEquipment: undefined
    }
  },

  async mounted() {
    this.inventory = await this.$axios.$get('/equipment');
  },

  methods: {
    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    onFormChange(form){
      this.FA = form
    },
  }
}
</script>

<style scoped>

</style>
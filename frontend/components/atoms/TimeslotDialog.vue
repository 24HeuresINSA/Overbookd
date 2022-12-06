<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        <span class="headline">Édition du charisme</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="charisma"
                label="Charisme"
                required
                type="number"
                :rules="[
                  (v) => !!v || 'Charisme requis',
                  (v) => v > 0 || 'Charisme doit être supérieur à 0',
                ]"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="save">Sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TimeslotDialog",
  props: {
    timeslot: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      charisma: 10,
      dialog: false,
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    async close() {
      this.dialog = false;
    },
    async save() {
      this.dialog = false;
      await this.$store.dispatch("timeslot/updateTimeslot", {
        id: this.timeslot.id,
        charisma: this.charisma,
      });
    },
  },
});
</script>

<style scoped></style>

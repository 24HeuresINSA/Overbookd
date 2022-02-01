<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-combobox
            ref="combobox"
            v-model="filters.fa"
            label="FA"
            clearable
            :items="FAs"
            :item-text="(item) => item.general.name"
          ></v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false"> Annuler </v-btn>
          <v-btn color="blue darken-1" text @click="validate"> Valider </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FA } from "~/utils/models/FA";
export default Vue.extend({
  name: "FAChooser",
  data() {
    return {
      dialog: false,
      dialogTitle: "Choix d'une FA parente pour la FT actuelle",
      filters: {
        fa: undefined as FA | undefined,
      },
      users: [],
      filteredUsers: [],
    };
  },
  computed: {
    FAs(): FA[] {
      return this.$accessor.FA.FAs;
    },
  },
  async mounted() {
    const res = await this.$accessor.FA.fetchAll();
  },
  methods: {
    async openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async validate() {
      await this.$accessor.FT.setParentFA(this.filters.fa!.count);
      this.closeDialog();
    },
  },
});
</script>

<style></style>

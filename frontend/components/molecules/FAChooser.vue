<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Choix d'une FA parente</span>
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-autocomplete
            v-model="selectedFAId"
            label="FA"
            :items="validatedFAs"
            item-value="id"
            item-text="name"
            autofocus
            auto-select-first
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog"> Annuler </v-btn>
          <v-btn
            color="blue darken-1"
            class="white--text"
            :disabled="isInvalidSelectedFA"
            @click="setParentFA"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FA, Status } from "~/utils/models/FA";
export default Vue.extend({
  name: "FAChooser",
  data: () => ({
    selectedFAId: -1,
  }),
  computed: {
    validatedFAs(): FA[] {
      return this.$accessor.FA.FAs /*.filter(
        (fa) => fa.status === Status.VALIDATED
      )*/;
    },
    isInvalidSelectedFA(): boolean {
      return this.selectedFAId === -1;
    },
  },
  async mounted() {
    await this.$accessor.FA.fetchFAs();
  },
  methods: {
    setParentFA() {
      if (this.isInvalidSelectedFA) return;
      this.$emit("change", this.selectedFAId);
      this.selectedFAId = -1;
    },
    closeDialog() {
      this.$emit("close-dialog");
      this.selectedFAId = -1;
    },
  },
});
</script>

<style></style>

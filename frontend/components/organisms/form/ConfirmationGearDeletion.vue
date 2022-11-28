<template>
  <v-card class="confirmation">
    <v-card-title class="confirmation__title">
      <h2>Suppression du Matos</h2>
      <v-btn icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p class="confirmation__statement">
        Vous etes sur le point de supprimer
        <strong>{{ gear.name }}</strong>
      </p>
      <div class="btn-group">
        <v-btn color="error" dark large @click="deleteGear">
          <v-icon left> mdi-delete </v-icon>Supprimer
        </v-btn>
        <v-btn color="warning" dark large @click="closeDialog">
          <v-icon left> mdi-close-circle-outline </v-icon>Annuler
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmationGearDeletion",
  props: {
    gear: {
      type: Object,
      default: () => ({ name: "", category: undefined }),
    },
  },
  methods: {
    async deleteGear() {
      await this.$accessor.catalog.deleteGear(this.gear);
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.confirmation {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__statement {
    font-size: 1.2rem;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    gap: 3%;
    .v-btn {
      flex-grow: 1;
    }
  }
}
</style>

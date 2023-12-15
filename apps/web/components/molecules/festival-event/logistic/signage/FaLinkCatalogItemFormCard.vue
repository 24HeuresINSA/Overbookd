<template>
  <v-card class="link-catalog-item-card">
    <v-btn class="link-catalog-item-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="link-catalog-item-card__title">
      <h2>Définir les référence des signalétiques</h2>
    </v-card-title>

    <v-card-subtitle>
      <p>
        Tu es sur le point de valider l'activité
        <strong>{{ activityName }}</strong> .
      </p>
      <p>
        Il faut d'abord tu assignes une référence du catalogue aux signalétiques
        demandées.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <FaSignageTable :signages="signages" @remove="removeSignage" />
    </v-card-text>

    <v-card-actions class="reject-card__actions">
      <v-btn
        :disabled="isMissingCatalogReference"
        color="primary"
        large
        @click="complete"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Finaliser
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Signage, isAssignedToCatalogItem } from "@overbookd/festival-activity";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signage/FaSignageTable.vue";

export default defineComponent({
  name: "FaLinkCatalogItemFormCard",
  components: { FaSignageTable },
  props: {
    signages: {
      type: Array as () => Signage[],
      default: () => [],
    },
  },
  emits: ["completed", "close-dialog"],
  computed: {
    activityName(): string {
      return this.$accessor.festivalActivity.selectedActivity.general.name;
    },
    isMissingCatalogReference(): boolean {
      return this.signages.some((signage) => !isAssignedToCatalogItem(signage));
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    complete() {
      this.$emit("completed");
      this.closeDialog();
    },
    removeSignage(signage: Signage) {
      this.$accessor.festivalActivity.removeSignage(signage.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.link-catalog-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  p {
    margin-bottom: 5px;
  }
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>

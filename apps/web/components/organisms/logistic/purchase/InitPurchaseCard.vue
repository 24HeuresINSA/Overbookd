<template>
  <v-card>
    <v-card-title> Ajouter une nouvelle Fiche Achat</v-card-title>
    <v-card-text>
      <v-text-field v-model="seller" label="Vendeur" />
      <DateTimeField
        v-model="availableOn"
        label="Date de disponibilité"
        :boxed="false"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="cantInitPurchase" @click="initPurchase">
        Créer la Fiche Achat
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { InitPurchaseForm } from "@overbookd/logistic";

type InitPurchaseCardData = {
  seller: string;
  availableOn: Date;
};

export default defineComponent({
  name: "InitPurchaseCard",
  components: { DateTimeField },
  emits: ["init"],
  data: (): InitPurchaseCardData => ({
    seller: "",
    availableOn: new Date(),
  }),
  computed: {
    cantInitPurchase(): boolean {
      const hasSeller = this.seller.trim();
      if (!hasSeller) return true;
      return !hasSeller;
    },
  },
  methods: {
    initPurchase() {
      if (!this.seller || !this.availableOn) return;
      const form: InitPurchaseForm = {
        seller: this.seller,
        availableOn: this.availableOn,
      };
      this.$emit("init", form);
    },
  },
});
</script>

<template>
  <v-card>
    <v-card-title>Ajouter une nouvelle Fiche Emprunt</v-card-title>
    <v-card-text>
      <v-text-field v-model="lender" label="Prêteur" />
      <DateTimeField
        v-model="availableOn"
        label="Date de disponibilité"
        :boxed="false"
      />
      <DateTimeField
        v-model="unavailableOn"
        label="Date de retour"
        :boxed="false"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="cantInitBorrow" @click="initBorrow">
        Créer la Fiche Emprunt
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { InitBorrowForm } from "@overbookd/logistic";
import { Period } from "@overbookd/period";

type InitBorrowCardData = {
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
};

export default defineComponent({
  name: "InitBorrowCard",
  components: { DateTimeField },
  emits: ["init"],
  data: (): InitBorrowCardData => ({
    lender: "",
    availableOn: new Date(),
    unavailableOn: new Date(),
  }),
  computed: {
    cantInitBorrow(): boolean {
      const hasLender = this.lender.trim();
      if (!hasLender) return true;

      try {
        Period.init({ start: this.availableOn, end: this.unavailableOn });
      } catch (error) {
        return true;
      }
      return false;
    },
  },
  methods: {
    initBorrow() {
      if (!this.lender || !this.availableOn || !this.unavailableOn) return;
      const form: InitBorrowForm = {
        lender: this.lender,
        availableOn: this.availableOn,
        unavailableOn: this.unavailableOn,
      };
      this.$emit("init", form);
    },
  },
});
</script>

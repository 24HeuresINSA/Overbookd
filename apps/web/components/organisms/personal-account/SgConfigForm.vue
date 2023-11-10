<template>
  <div>
    <v-card class="Fut_Config">
      <v-card-title class="Fut_Config__title">
        <h2>Configuration SG</h2>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <MoneyField
            v-model="tempBarrelPrices.prixFutBlonde"
            label="Prix fût blonde"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempBarrelPrices.prixFutBlanche"
            label="Prix fût blanche"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempBarrelPrices.prixFutTriple"
            label="Prix fût Triple"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempBarrelPrices.prixFutFlower"
            label="Prix fût Flower"
            @keydown.enter="save"
          >
          </MoneyField>
        </v-form>
      </v-card-text>
      <v-card-actions class="Fut_Config__actions">
        <v-btn color="primary" @click="save">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BarrelPrices } from "@overbookd/personal-account";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";

export default Vue.extend({
  name: "SgConfigForm",
  components: { MoneyField },
  data() {
    return {
      tempBarrelPrices: {
        prixFutBlonde: 0,
        prixFutBlanche: 0,
        prixFutTriple: 0,
        prixFutFlower: 0,
      } as BarrelPrices,
      valid: false,
    };
  },
  computed: {
    barrelPrices(): BarrelPrices {
      return (this.$accessor.configuration.get("sg") ||
        this.tempBarrelPrices) as BarrelPrices;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("sg");
    this.tempBarrelPrices = { ...this.barrelPrices };
  },
  methods: {
    save() {
      const prices = {
        prixFutBlonde: +this.tempBarrelPrices.prixFutBlonde,
        prixFutBlanche: +this.tempBarrelPrices.prixFutBlanche,
        prixFutTriple: +this.tempBarrelPrices.prixFutTriple,
        prixFutFlower: +this.tempBarrelPrices.prixFutFlower,
      };

      this.$accessor.configuration.saveBarrelPrices(prices);
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.Fut_Config {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>

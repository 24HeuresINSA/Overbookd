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
            v-model="tempSgConfig.prixFutBlonde"
            label="Prix fût blonde"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempSgConfig.prixFutBlanche"
            label="Prix fût blanche"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempSgConfig.prixFutTriple"
            label="Prix fût Triple"
            @keydown.enter="save"
          >
          </MoneyField>
          <MoneyField
            v-model="tempSgConfig.prixFutFlower"
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
import { SgConfig } from "~/utils/models/configuration.model";
import { Configuration } from "@overbookd/configuration";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";


export default Vue.extend({
  name: "SgConfigForm",
  components: { MoneyField },
  data() {
    return {
      tempSgConfig: {
        prixFutBlonde: 0,
        prixFutBlanche: 0,
        prixFutTriple: 0,
        prixFutFlower: 0,
      } as SgConfig,
      valid: false,
    };
  },
  computed: {
    sgConfig(): SgConfig {
      return (this.$accessor.configuration.get("sg") ||
        this.tempSgConfig) as SgConfig;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("sg");
    this.tempSgConfig = { ...this.sgConfig };
  },
  methods: {
    save() {
      const configuration: Configuration = {
        key: "sg",
        value: {
          prixFutBlonde: +this.tempSgConfig.prixFutBlonde,
          prixFutBlanche: +this.tempSgConfig.prixFutBlanche,
          prixFutTriple: +this.tempSgConfig.prixFutTriple,
          prixFutFlower: +this.tempSgConfig.prixFutFlower,
        },
      };
      this.$accessor.configuration.save(configuration);
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

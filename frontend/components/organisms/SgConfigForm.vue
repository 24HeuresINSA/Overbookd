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
          <v-text-field
            v-model="tempSgConfig.prixFutBlonde"
            label="Prix fût blonde"
            prefix="€"
            type="number"
            required
            @keydown.enter="save"
          >
          </v-text-field>
          <v-text-field
            v-model="tempSgConfig.prixFutBlanche"
            label="Prix fût blanche"
            prefix="€"
            type="number"
            required
            @keydown.enter="save"
          >
          </v-text-field>
          <v-text-field
            v-model="tempSgConfig.prixFutTriple"
            label="Prix fût Triple"
            prefix="€"
            type="number"
            @keydown.enter="save"
          >
          </v-text-field>
          <v-text-field
            v-model="tempSgConfig.prixFutFlower"
            label="Prix fût Flower"
            prefix="€"
            type="number"
            required
            @keydown.enter="save"
          >
          </v-text-field>
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
import { Configuration } from "~/utils/models/Configuration";
import cloneDeep from "lodash/cloneDeep";

type SgConfig = {
  prixFutBlonde: number;
  prixFutBlanche: number;
  prixFutTriple: number;
  prixFutFlower: number;
};

export default Vue.extend({
  name: "SgConfigForm",
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
      return this.$accessor.configuration.get("sg") as SgConfig;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("sg");
    this.tempSgConfig = cloneDeep(this.sgConfig);
  },
  methods: {
    save() {
      const configuraion: Configuration = {
        key: "sg",
        value: this.tempSgConfig,
      };
      this.$accessor.configuration.update(configuraion);
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

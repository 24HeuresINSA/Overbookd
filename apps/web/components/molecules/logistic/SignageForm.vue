<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Signalisation</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="fields">
          <v-text-field
            v-model="name"
            append-icon="mdi-hammer-screwdriver"
            label="Nom de la signalisation"
            clearable
            outlined
            clear-icon="mdi-close-circle-outline"
            counter
            :rules="[rules.nameMinLength]"
          ></v-text-field>
          <h3>Type de la signatlisation</h3>
          <v-select
            v-model="type"
            type="select"
            :items="signageTypes"
            :rules="[rules.typeRequired]"
          ></v-select>
          <h3>Image pour la signalisation</h3>
          <v-file-input
            v-model="signaImage"
            :rules="rules.imageRules"
            label="Photo de la Signa"
            prepend-icon="mdi-camera"
            accept="image/png, image/jpeg"
            show-size
          />
        </div>
        <v-btn color="success" dark large @click="createOrUpdateSignage">
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
          Sauvegarder la signalisation
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { InputRulesData, minLength, required } from "~/utils/rules/input.rules";
import { imageRules, isImageValid } from "~/utils/rules/file-image.rules";
import {
  Signage,
  SignageForm,
  SignageType,
  signageTypes,
} from "@overbookd/signa";

interface SignageFormData extends InputRulesData {
  name: string;
  type: SignageType;
}

const nameMinLength = 3;

export default Vue.extend({
  name: "SignageForm",
  props: {
    signage: {
      type: Object,
      default: () => ({
        name: "",
        type: signageTypes.AFFICHE,
      }),
    },
  },
  data(): SignageFormData {
    return {
      name: this.signage.name,
      type: this.signage.type,
      rules: {
        nameMinLength: minLength(nameMinLength),
        typeRequired: required,
      },
    };

  },
  computed: {
    signageTypes(): SignageType[] {
      return Object.values(signageTypes);
    },
  },
  watch: {
    signage(signage: Signage) {
      this.name = signage.name;
      this.type = signage.type;
    },
  },
  methods: {
    async createOrUpdateSignage() {
      if (!this.name || !this.type) return;
      const signage: SignageForm = {
        name: this.name,
        type: this.type,
      };

      this.signage.id
        ? this.$accessor.catalogSignage.updateSignage({
            ...signage,
            id: this.signage.id,
          })
        : this.$accessor.catalogSignage.createSignage(signage);

      this.closeDialog();
      this.name = "";
      this.type = signageTypes.AFFICHE;
    },
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.signage {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .fields {
      width: 80%;
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>

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
            v-model="image"
            :rules="[fileRules.imageRules]"
            label="Photo de la Signa"
            prepend-icon="mdi-camera"
            accept="image/png, image/jpeg"
            show-size
          />
        </div>
        <v-btn color="success" :disabled="invalidForm" @click="createOrUpdateSignage">
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
          Sauvegarder la signalisation
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  InputRulesDataWithImage,
  minLength,
  required,
  imageRules,
} from "~/utils/rules/input.rules";
import {
  Signage,
  SignageForm,
  SignageType,
  signageTypes,
} from "@overbookd/signa";

interface SignageFormData extends InputRulesDataWithImage {
  name: string;
  type: SignageType;
  image: File | null;
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
      image: null,
      rules: {
        nameMinLength: minLength(nameMinLength),
        typeRequired: required,
      },
      fileRules: {
        imageRules: imageRules,
      },
    };
  },

  computed: {
    signageTypes(): SignageType[] {
      return Object.values(signageTypes);
    },
    invalidForm(): boolean {
    const isNameValid = this.name.length >= nameMinLength;
    const isTypeValid = !!this.type;
    const isUploadValid = this.image ? imageRules(this.image) : true;

    return !isNameValid || !isTypeValid || !isUploadValid;
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

      let newSigna;

      if (this.signage.id) {
        newSigna = await this.$accessor.catalogSignage.updateSignage({
            ...signage,
            id: this.signage.id,
          });
      } else {
        newSigna = await this.$accessor.catalogSignage.createSignage(signage);
      }

      if (this.image) {
        const signaImageForm = new FormData();
        signaImageForm.append("file", this.image, this.image.name);
        this.$accessor.catalogSignage.uploadSignageImage({
          signageId: this.signage.id || newSigna.id,
          signageImage: signaImageForm,
        });
      }

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

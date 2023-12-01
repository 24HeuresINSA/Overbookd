<template>
  <v-card class="signage-card">
    <v-btn class="signage-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="signage-card__title">
      <h2>{{ typeFormLabel }} une signalétique</h2>
    </v-card-title>

    <v-card-text>
      <v-select
        v-model="type"
        type="select"
        label="Type"
        :items="signageTypes"
      />
      <v-text-field v-model="text" label="Texte à écrire" />
      <v-text-field
        v-model="quantity"
        label="Quantité"
        type="number"
        :rules="[rules.number, rules.min]"
      />
      <v-text-field v-model="size" label="Taille" />
      <v-text-field v-model="comment" label="Commentaire" />
    </v-card-text>

    <v-card-actions class="signage-card__actions">
      <v-btn
        :disabled="!canConfirmSignage"
        color="success"
        @click="confirmSignage"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        {{ typeFormLabel }} la signalétique
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Signage, PANNEAU } from "@overbookd/festival-activity";
import { isNumber, min } from "~/utils/rules/input.rules";
import { SignageType, signageTypes } from "@overbookd/signa";

interface SignageFormData {
  type: Signage["type"];
  text: string;
  quantity: number;
  size: string;
  comment: string | null;
  rules: {
    number: (v: string) => boolean | string;
    min: (v: string) => boolean | string;
  };
}

export default defineComponent({
  name: "FaSignageForm",
  props: {
    signage: {
      type: Object as () => Signage | null,
      default: () => null,
    },
  },
  data: ({ signage }): SignageFormData => ({
    type: signage?.type ?? PANNEAU,
    text: signage?.text ?? "",
    quantity: signage?.quantity ?? 1,
    size: signage?.size ?? "",
    comment: signage?.comment ?? null,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    signageTypes(): SignageType[] {
      return Object.values(signageTypes);
    },
    isUpdate(): boolean {
      return this.signage !== null;
    },
    canConfirmSignage(): boolean {
      return Boolean(
        this.type &&
          this.text?.trim() &&
          this.size?.trim() &&
          this.quantity &&
          this.quantity > 1,
      );
    },
    typeFormLabel(): string {
      return this.signage !== null ? "Modifier" : "Ajouter";
    },
  },
  methods: {
    confirmSignage() {
      if (!this.canConfirmSignage) return;

      const signage = {
        type: this.type,
        text: this.text.trim(),
        quantity: +this.quantity,
        size: this.size.trim(),
        comment: this.comment?.trim(),
      };

      if (this.isUpdate) {
        this.$emit("update", { ...signage, id: this.signage?.id });
      } else {
        this.$emit("add", signage);
      }
      this.closeDialog();
      this.clearFields();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    clearFields() {
      this.type = PANNEAU;
      this.text = "";
      this.quantity = 1;
      this.size = "";
      this.comment = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.signage-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__form {
    padding-bottom: 0;
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

<template>
  <v-card class="signage-card">
    <v-btn class="signage-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="signage-card__title">
      <h2>{{ typeFormLabel }} une signalétique</h2>
    </v-card-title>

    <v-card-subtitle>
      Les champs marqués par <strong>*</strong> sont obligatoires.
    </v-card-subtitle>

    <v-card-text>
      <v-select
        v-model="type"
        type="select"
        label="Type *"
        :items="signageTypes"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="text"
        label="Texte à écrire *"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="quantity"
        label="Quantité *"
        type="number"
        :rules="[rules.number, rules.min]"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="size"
        label="Taille *"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="comment"
        label="Commentaire"
        @keydown.enter="confirmSignage"
      />
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
import { Signage, PANNEAU, signageTypes } from "@overbookd/festival-event";
import { isNumber, min } from "~/utils/rules/input.rules";

type SignageFormData = {
  type: Signage["type"];
  text: string;
  quantity: number;
  size: string;
  comment: string | null;
  rules: {
    number: (v: string) => boolean | string;
    min: (v: string) => boolean | string;
  };
};

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
    signageTypes(): Signage["type"][] {
      return Object.values(signageTypes);
    },
    isUpdate(): boolean {
      return this.signage !== null;
    },
    canConfirmSignage(): boolean {
      const hasType = this.type !== null;
      const hasAtLeastOne = this.quantity > 0;
      const hasText = this.text.trim() !== "";
      const hasSize = this.size.trim() !== "";
      return hasType && hasAtLeastOne && hasText && hasSize;
    },
    typeFormLabel(): string {
      return this.isUpdate ? "Modifier" : "Ajouter";
    },
  },
  watch: {
    signage: {
      handler() {
        this.setSignage();
      },
    },
  },
  methods: {
    confirmSignage() {
      if (!this.canConfirmSignage) return;

      const comment = this.comment?.trim();
      const signage = {
        type: this.type,
        text: this.text.trim(),
        quantity: +this.quantity,
        size: this.size.trim(),
        comment: comment !== "" ? comment : null,
      };

      if (this.isUpdate) {
        this.$emit("update", { ...signage, id: this.signage?.id });
      } else {
        this.$emit("add", signage);
      }
      this.closeDialog();
      this.clearSignage();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    setSignage() {
      if (!this.signage) return this.clearSignage();

      this.type = this.signage.type;
      this.text = this.signage.text;
      this.quantity = this.signage.quantity;
      this.size = this.signage.size;
      this.comment = this.signage.comment;
    },
    clearSignage() {
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
  strong {
    font-weight: 900;
  }
}
</style>

<template>
  <v-card class="form-card">
    <v-card-title>
      <span class="headline"> {{ statusFormLabel }} un besoin de signa </span>
    </v-card-title>

    <v-card-text>
      <v-select
        v-model="signaType"
        type="select"
        label="Type*"
        :items="signaTypes"
      ></v-select>

      <v-text-field v-model="text" label="Texte signalétique*"></v-text-field>

      <v-text-field
        v-model="count"
        type="number"
        label="Nombre*"
        :rules="[rules.number, rules.min]"
      ></v-text-field>

      <v-text-field v-model="size" label="Taille"></v-text-field>

      <v-text-field v-model="comment" label="Commentaire"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="confirmSignaNeed">
        {{ statusFormLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SignaType } from "~/utils/models/fa.model";
import { isNumber, min } from "~/utils/rules/input.rules";

interface SignaNeedData {
  signaType: SignaType;
  text: string;
  count: string;
  size?: string;
  comment?: string;
  rules: {
    number: (v: string) => boolean | string;
    min: (v: string) => boolean | string;
  };
}

export default Vue.extend({
  name: "SignaNeedForm",
  model: {
    prop: "signaNeed",
    event: "change",
  },
  props: {
    signaNeed: {
      type: Object,
      default: () => null,
    },
  },
  data: (): SignaNeedData => ({
    signaType: SignaType.AFFICHE,
    text: "",
    count: "1",
    size: undefined,
    comment: undefined,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    signaTypes(): SignaType[] {
      return Object.values(SignaType);
    },
    isFormInvalid(): boolean {
      return (
        this.signaType === undefined ||
        this.text === undefined ||
        !this.text?.trim() ||
        this.count === undefined ||
        +this.count < 1
      );
    },
    statusFormLabel(): string {
      return this.signaNeed !== null ? "Modifier" : "Ajouter";
    },
  },
  watch: {
    signaNeed() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.signaNeed) return this.clearLocalVariable();

      this.signaType = this.signaNeed?.signaType;
      this.text = this.signaNeed?.text;
      this.count = this.signaNeed?.count;
      this.size = this.signaNeed?.size;
      this.comment = this.signaNeed?.comment;
    },
    clearLocalVariable() {
      this.signaType = SignaType.AFFICHE;
      this.text = "";
      this.count = "1";
      this.size = undefined;
      this.comment = undefined;
    },
    confirmSignaNeed() {
      if (this.isFormInvalid) {
        return this.$accessor.notif.pushNotification({
          message: "❌ Tu dois compléter tous les champs avec une * !",
        });
      }

      const signaNeed = {
        id: this.signaNeed?.id,
        signaType: this.signaType,
        text: this.text?.trim(),
        count: +this.count,
        size: this.size?.trim(),
        comment: this.comment?.trim(),
      };

      this.$emit("change", signaNeed);
      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
    showErrorMessage(message: string) {
      return this.$accessor.notif.pushNotification({ message });
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;
}
</style>

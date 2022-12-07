<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>Presta</v-card-title>
    <v-card-subtitle
      >Si ton activité n'a pas de prestataire, tu dois laisser tous les champs
      vides.</v-card-subtitle
    >
    <v-card-text>
      <v-form v-model="isComplete">
        <v-text-field
          :value="collaborator.firstname"
          label="Prénom de l'intervenant*"
          :rules="ruleRequired"
          :disabled="isDisabled"
          @change="onChange('firstname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.lastname"
          label="Nom de l'intervenant*"
          :rules="ruleRequired"
          :disabled="isDisabled"
          @change="onChange('lastname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.phone"
          label="Téléphone*"
          :rules="rulePhone"
          :disabled="isDisabled"
          @change="onChange('phone', $event)"
        >
        </v-text-field>
        <v-text-field
          :value="collaborator.email"
          label="E-mail"
          :disabled="isDisabled"
          @change="onChange('email', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.company"
          label="Société"
          :disabled="isDisabled"
          @change="onChange('company', $event)"
        >
        </v-text-field>
        <v-text-field
          :value="collaborator.comment"
          label="Commentaire"
          :disabled="isDisabled"
          @change="onChange('comment', $event)"
        >
        </v-text-field>
      </v-form>
      <p v-if="!isEmpty && !isComplete" class="red-text">
        ⚠️ N'oublie pas de compléter les champs avec un * avant de soumettre ta
        FA !
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { collaborator, fa_collaborators } from "~/utils/models/FA";

export default Vue.extend({
  name: "CollaboratorCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    isComplete: false,
  }),
  computed: {
    collaborators(): any {
      return this.$accessor.FA.mFA.fa_collaborators;
    },
    collaborator(): collaborator {
      const collaborators = this.$accessor.FA.mFA.fa_collaborators;
      if (collaborators && collaborators.length > 0) {
        return collaborators[0].collaborator;
      }
      return {};
    },
    isEmpty(): boolean {
      // eslint-disable-next-line no-unused-vars
      const { id, ...rest } = this.collaborator;
      return Object.keys(rest).length === 0;
    },
    rulePhone(): any {
      return [
        (v: any) =>
          new RegExp(`^$|0[6-7]{1}[0-9]{8}$`).test(v) ||
          `ce numéro de téléphone n'est pas valide`,
        (v: any) => !!v || "ce champs est requis si tu veux ajouter un presta",
      ];
    },
    ruleEmail(): any {
      return [
        (v: any) =>
          new RegExp(`^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`).test(v) ||
          `cet email n'est pas valide`,
      ];
    },
    ruleRequired(): any {
      return [
        (v: any) => !!v || "ce champs est requis si tu veux ajouter un presta",
      ];
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (this.collaborators.length === 0) {
        const newCollaborator: fa_collaborators = {
          collaborator: {},
        };
        this.$accessor.FA.addCollaborator(newCollaborator);
      }

      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateCollaborator({
        index: 0,
        key: key,
        value: value,
      });

      // eslint-disable-next-line no-unused-vars
      const { id, ...rest } = this.collaborator;
      if (Object.values(rest).every((value) => value == "")) {
        this.$accessor.FA.deleteCollaborator(0);
      }
    },
  },
});
</script>

<style scoped>
.red-text {
  color: red;
}

.disabled {
  border-left: 5px solid green;
}
</style>

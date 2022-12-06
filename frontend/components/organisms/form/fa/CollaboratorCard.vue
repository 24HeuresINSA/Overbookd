<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>Presta</v-card-title>
    <v-card-subtitle
      >Si ton activité n'a pas de prestataire, tu dois laisser tous les champs
      vides.</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <v-text-field
          :value="collaborator.firstname"
          label="Prénom de l'intervenant*"
          :disabled="isDisabled"
          @change="onChange('firstname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.lastname"
          label="Nom de l'intervenant*"
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
          :rules="ruleEmail"
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
    rulePhone(): any {
      return [
        (v: any) =>
          new RegExp(`^$|0[1-7]{1}[0-9]{8}$`).test(v) ||
          `ce numéro de téléphone n'est pas valide`,
      ];
    },
    ruleEmail(): any {
      return [
        (v: any) =>
          new RegExp(`^$|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`).test(v) ||
          `cet email n'est pas valide`,
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

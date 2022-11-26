<template>
  <v-card>
    <v-card-title>Presta</v-card-title>
    <v-card-text>
      <v-form v-model="isComplete">
        <v-text-field
          :value="collaborator.firstname"
          label="Prénom de l'intervenant*"
          required
          @change="onChange('firstname', $event)"
        ></v-text-field>
        <v-text-field
          :valuel="collaborator.lastname"
          label="Nom de l'intervenant*"
          required
          @change="onChange('lastname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.phone"
          label="Téléphone*"
          :rules="regexPhone"
          required
          @change="onChange('phone', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.email"
          label="E-mail"
          :rules="regexEmail"
          @change="onChange('email', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.company"
          label="Société"
          @change="onChange('company', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.comment"
          label="Commentaire"
          @change="onChange('comment', $event)"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { collaborator, fa_collaborator } from "~/utils/models/FA";

export default Vue.extend({
  name: "CollaboratorCard",
  data: () => ({
    isComplete: false,
  }),
  computed: {
    collaborators(): any {
      return this.$accessor.FA.mFA.fa_collaborator;
    },
    collaborator(): collaborator {
      const collaborators = this.$accessor.FA.mFA.fa_collaborator;
      if (collaborators && collaborators.length > 0)
        return collaborators[0].collaborator;
      return {};
    },
    isEmpty(): boolean {
      // eslint-disable-next-line no-unused-vars
      const { id, ...rest } = this.collaborator;
      return Object.values(rest).every((value) => value == "");
    },
    regexPhone(): any {
      return [
        (v: any) =>
          new RegExp(`0[6-7]{1}[0-9]{8}$`).test(v) ||
          `ce numéro de téléphone n'est pas valide`,
      ];
    },
    regexEmail(): any {
      return [
        (v: any) =>
          new RegExp(`^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`).test(v) ||
          `cet email n'est pas valide`,
      ];
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (this.collaborators.length === 0) {
        const newCollaborator: fa_collaborator = {
          fa_id: +this.$route.params.fa,
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

      if (this.isEmpty) this.$accessor.FA.deleteCollaborator(0);
    },
  },
});
</script>

<style scoped></style>

<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Presta</v-card-title>
    <v-card-subtitle
      >Si ton activité n'a pas de prestataire, tu dois laisser tous les champs
      vides.</v-card-subtitle
    >
    <v-card-text>
      <v-switch
        v-model="isCollaboratorRequired"
        label="Besoin presta"
        :disabled="isValidatedByOwner"
        @change="onSwitch()"
      ></v-switch>
      <v-form v-if="isCollaboratorRequired">
        <v-text-field
          :value="collaborator.firstname"
          label="Prénom de l'intervenant*"
          :disabled="isValidatedByOwner"
          @change="onChange('firstname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.lastname"
          label="Nom de l'intervenant*"
          :disabled="isValidatedByOwner"
          @change="onChange('lastname', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.phone"
          label="Téléphone*"
          :rules="rulePhone"
          :disabled="isValidatedByOwner"
          @change="onChange('phone', $event)"
        >
        </v-text-field>
        <v-text-field
          :value="collaborator.email"
          label="E-mail"
          :rules="ruleEmail"
          :disabled="isValidatedByOwner"
          @change="onChange('email', $event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.company"
          label="Société"
          :disabled="isValidatedByOwner"
          @change="onChange('company', $event)"
        >
        </v-text-field>
        <v-text-field
          :value="collaborator.comment"
          label="Commentaire"
          :disabled="isValidatedByOwner"
          @change="onChange('comment', $event)"
        >
        </v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import {
  collaborator,
  FA,
  fa_card_type,
  fa_collaborators,
} from "~/utils/models/FA";
import CardErrorList from "~/components/molecules/CardErrorList.vue";

export default Vue.extend({
  name: "CollaboratorCard",
  components: { CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: fa_card_type.COLLABORATOR,
    isCollaboratorRequired: false,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    collaborators(): fa_collaborators[] {
      return this.mFA.fa_collaborators ?? [];
    },
    collaborator(): collaborator {
      const collaborators = this.mFA.fa_collaborators;
      if (collaborators && collaborators.length > 0) {
        return collaborators[0].collaborator;
      }
      return {};
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
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
  watch: {
    collaborators: {
      handler() {
        if (this.collaborators.length > 0) {
          this.isCollaboratorRequired = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    onSwitch() {
      if (!this.isCollaboratorRequired) {
        this.deleteCollaborator();
      } else {
        this.addCollaborator();
      }
    },
    onChange(key: string, value: any) {
      this.updateCollaborator(key, value);
    },
    addCollaborator() {
      const newCollaborator: fa_collaborators = {
        collaborator: {
          firstname: "",
          lastname: "",
          phone: "",
        },
      };
      this.$accessor.FA.addCollaborator(newCollaborator);
    },
    updateCollaborator(key: string, value: any) {
      this.$accessor.FA.updateCollaborator({
        index: 0,
        key: key,
        value: value,
      });
    },
    deleteCollaborator() {
      this.$accessor.FA.deleteCollaborator(0);
    },
  },
});
</script>

<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Presta</v-card-title>
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
          @change="updateFirstname($event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.lastname"
          label="Nom de l'intervenant*"
          :disabled="isValidatedByOwner"
          @change="updateLastname($event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.phone"
          label="Téléphone*"
          :rules="rulePhone"
          :disabled="isValidatedByOwner"
          @change="updatePhone($event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.email"
          label="E-mail"
          :rules="ruleEmail"
          :disabled="isValidatedByOwner"
          @change="updateEmail($event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.company"
          label="Société"
          :disabled="isValidatedByOwner"
          @change="updateCollaborator($event)"
        ></v-text-field>
        <v-text-field
          :value="collaborator.comment"
          label="Commentaire"
          :disabled="isValidatedByOwner"
          @change="updateComment($event)"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import { Collaborator, Fa, FaCardType } from "~/utils/models/fa.model";

type VuetifyRule = (value: null | string) => boolean | string;

export default Vue.extend({
  name: "CollaboratorCard",
  components: { CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FaCardType.COLLABORATOR,
    isCollaboratorRequired: false,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    collaborator(): Collaborator {
      if (!this.mFA.collaborator) {
        return {
          firstname: "",
          lastname: "",
          phone: "",
        };
      }
      return this.mFA.collaborator;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
    rulePhone(): VuetifyRule[] {
      return [
        (v) =>
          new RegExp("^$|0[1-7]{1}[0-9]{8}$").test(v?.toString() || "") ||
          "ce numéro de téléphone n'est pas valide",
      ];
    },
    ruleEmail(): VuetifyRule[] {
      return [
        (v) =>
          new RegExp("^$|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(
            v?.toString() || "",
          ) || "cet email n'est pas valide",
      ];
    },
  },
  mounted() {
    if (this.mFA.collaborator) {
      this.isCollaboratorRequired = true;
    }
  },
  methods: {
    onSwitch() {
      if (!this.isCollaboratorRequired) {
        this.deleteCollaborator();
      }
    },
    updateFirstname(firstname: string) {
      this.updateCollaborator({ firstname: firstname.trim() });
    },
    updateLastname(lastname: string) {
      this.updateCollaborator({ lastname: lastname.trim() });
    },
    updatePhone(phone: string) {
      this.updateCollaborator({ firstname: phone.trim() });
    },
    updateEmail(email: string) {
      this.updateCollaborator({ email: email.trim() });
    },
    updateCompany(company: string) {
      this.updateCollaborator({ firstname: company.trim() });
    },
    updateComment(comment: string) {
      this.updateCollaborator({ comment: comment.trim() });
    },
    updateCollaborator(collaboratorChunk: Partial<Collaborator>) {
      this.$accessor.fa.updateCollaborator({
        ...this.collaborator,
        ...collaboratorChunk,
      });
    },
    deleteCollaborator() {
      this.$accessor.fa.deleteCollaborator();
    },
  },
});
</script>

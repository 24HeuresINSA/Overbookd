<template>
  <v-card class="contractor-card">
    <v-btn class="contractor-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="contractor-card__title">
      <h2>{{ typeFormLabel }} un prestataire</h2>
    </v-card-title>

    <v-card-subtitle>
      Les champs marqués par <strong>*</strong> sont obligatoires.
    </v-card-subtitle>

    <v-card-text>
      <v-text-field
        v-model="firstname"
        label="Prénom *"
        @keydown.enter="confirmContractor"
      />
      <v-text-field
        v-model="lastname"
        label="Nom *"
        @keydown.enter="confirmContractor"
      />
      <v-text-field
        v-model="phone"
        label="Téléphone *"
        @keydown.enter="confirmContractor"
      />
      <v-text-field
        v-model="email"
        label="Email"
        @keydown.enter="confirmContractor"
      />
      <v-text-field
        v-model="company"
        label="Société"
        @keydown.enter="confirmContractor"
      />
      <v-text-field
        v-model="comment"
        label="Commentaire"
        @keydown.enter="confirmContractor"
      />
    </v-card-text>

    <v-card-actions class="contractor-card__actions">
      <v-btn
        :disabled="!canConfirmContractor"
        color="success"
        @click="confirmContractor"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        {{ typeFormLabel }} le prestataire
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Contractor } from "@overbookd/festival-event";

interface ContractorFormData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string | null;
  company: string | null;
  comment: string | null;
}

export default defineComponent({
  name: "ContractorForm",
  props: {
    contractor: {
      type: Object as () => Contractor | null,
      default: () => null,
    },
  },
  data: ({ contractor }): ContractorFormData => ({
    firstname: contractor?.firstname ?? "",
    lastname: contractor?.lastname ?? "",
    phone: contractor?.phone ?? "",
    email: contractor?.email ?? null,
    company: contractor?.company ?? null,
    comment: contractor?.comment ?? null,
  }),
  computed: {
    isUpdate(): boolean {
      return this.contractor !== null;
    },
    canConfirmContractor(): boolean {
      const hasFirstname = this.firstname.trim() !== "";
      const hasLastname = this.lastname.trim() !== "";
      const hasPhone = this.phone.trim() !== "";
      return hasFirstname && hasLastname && hasPhone;
    },
    typeFormLabel(): string {
      return this.isUpdate ? "Modifier" : "Ajouter";
    },
  },
  watch: {
    contractor: {
      handler() {
        this.setContractor();
      },
    },
  },
  methods: {
    confirmContractor() {
      if (!this.canConfirmContractor) return;

      const email = this.email?.trim();
      const company = this.company?.trim();
      const comment = this.comment?.trim();
      const contractor = {
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
        email: email !== "" ? email : null,
        company: company !== "" ? company : null,
        comment: comment !== "" ? comment : null,
      };

      if (this.isUpdate) {
        this.$emit("update", { ...contractor, id: this.contractor?.id });
      } else {
        this.$emit("add", contractor);
      }
      this.closeDialog();
      this.clearContractor();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    setContractor() {
      if (!this.contractor) return this.clearContractor();

      this.firstname = this.contractor.firstname;
      this.lastname = this.contractor.lastname;
      this.phone = this.contractor.phone;
      this.email = this.contractor.email;
      this.company = this.contractor.company;
      this.comment = this.contractor.comment;
    },
    clearContractor() {
      this.firstname = "";
      this.lastname = "";
      this.phone = "";
      this.email = null;
      this.company = null;
      this.comment = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.contractor-card {
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

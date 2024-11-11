<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} un prestataire </template>
    <template #content>
      <form>
        <v-text-field
          v-model="firstname"
          label="Prénom *"
          :rules="[rules.required]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="lastname"
          label="Nom *"
          :rules="[rules.required]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="phone"
          label="Téléphone *"
          :rules="[rules.required, rules.phone]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="email"
          label="Email"
          inputmode="email"
          :rules="[rules.email]"
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
          hide-details
          @keydown.enter="confirmContractor"
        />
      </form>
    </template>

    <template #actions>
      <v-btn
        :disabled="!canConfirmContractor"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :text="`${typeFormLabel} le prestataire`"
        size="large"
        rounded
        @click="confirmContractor"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Contractor } from "@overbookd/festival-event";
import {
  isEmail,
  isMobilePhoneNumber,
  required,
} from "~/utils/rules/input.rules";

const emit = defineEmits(["add", "update", "close"]);

const props = defineProps({
  contractor: {
    type: Object as PropType<Contractor | null>,
    default: () => null,
  },
});

const firstname = ref<string>("");
const lastname = ref<string>("");
const phone = ref<string>("");
const email = ref<string | null>(null);
const company = ref<string | null>(null);
const comment = ref<string | null>(null);

const isUpdate = computed<boolean>(() => props.contractor !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const rules = {
  required: required,
  email: isEmail,
  phone: isMobilePhoneNumber,
};

const clearContractor = () => {
  firstname.value = "";
  lastname.value = "";
  phone.value = "";
  email.value = null;
  company.value = null;
  comment.value = null;
};
const setContractor = () => {
  if (!props.contractor) return clearContractor();

  firstname.value = props.contractor.firstname;
  lastname.value = props.contractor.lastname;
  phone.value = props.contractor.phone;
  email.value = props.contractor.email;
  company.value = props.contractor.company;
  comment.value = props.contractor.comment;
};
watch(() => props.contractor, setContractor, { immediate: true });

const canConfirmContractor = computed<boolean>(() => {
  const hasFirstname = firstname.value.trim() !== "";
  const hasLastname = lastname.value.trim() !== "";
  const hasPhone = rules.phone(phone.value) === true;
  return hasFirstname && hasLastname && hasPhone;
});
const close = () => emit("close");
const confirmContractor = () => {
  if (!canConfirmContractor.value) return;

  const emailValue = email.value?.trim();
  const companyValue = company.value?.trim();
  const commentValue = comment.value?.trim();
  const contractor = {
    firstname: firstname.value,
    lastname: lastname.value,
    phone: phone.value,
    email: emailValue || null,
    company: companyValue || null,
    comment: commentValue || null,
  };

  if (isUpdate.value) {
    emit("update", { ...contractor, id: props.contractor?.id });
  } else {
    emit("add", contractor);
  }
  close();
  clearContractor();
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>

<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} un prestataire </template>
    <template #content>
      <form>
        <v-text-field
          v-model="firstName"
          label="Prénom *"
          :rules="[required]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="lastName"
          label="Nom *"
          :rules="[required]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="phoneNumber"
          label="Téléphone *"
          :rules="[required, isPhoneNumber]"
          @keydown.enter="confirmContractor"
        />
        <v-text-field
          v-model="email"
          label="Email"
          inputmode="email"
          :rules="[isEmail]"
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
import { isEmail, isPhoneNumber, required } from "~/utils/rules/input.rules";

const emit = defineEmits(["add", "update", "close"]);

const props = defineProps({
  contractor: {
    type: Object as PropType<Contractor | null>,
    default: () => null,
  },
});

const firstName = ref<string>("");
const lastName = ref<string>("");
const phoneNumber = ref<string>("");
const email = ref<string | null>(null);
const company = ref<string | null>(null);
const comment = ref<string | null>(null);

const isUpdate = computed<boolean>(() => props.contractor !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const clearContractor = () => {
  firstName.value = "";
  lastName.value = "";
  phoneNumber.value = "";
  email.value = null;
  company.value = null;
  comment.value = null;
};
const setContractor = () => {
  if (!props.contractor) return clearContractor();

  firstName.value = props.contractor.firstName;
  lastName.value = props.contractor.lastName;
  phoneNumber.value = props.contractor.phoneNumber;
  email.value = props.contractor.email;
  company.value = props.contractor.company;
  comment.value = props.contractor.comment;
};
watch(() => props.contractor, setContractor, { immediate: true });

const canConfirmContractor = computed<boolean>(() => {
  const hasFirstName = firstName.value.trim() !== "";
  const hasLastName = lastName.value.trim() !== "";
  const hasPhone = isPhoneNumber(phoneNumber.value) === true;
  return hasFirstName && hasLastName && hasPhone;
});
const close = () => emit("close");
const confirmContractor = () => {
  if (!canConfirmContractor.value) return;

  const emailValue = email.value?.trim();
  const companyValue = company.value?.trim();
  const commentValue = comment.value?.trim();
  const contractor = {
    firstName: firstName.value,
    lastName: lastName.value,
    phoneNumber: phoneNumber.value,
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

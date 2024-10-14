<template>
  <ConfirmationDialogCard @confirm="addVolunteer" @close="close">
    <template #title>Ajouter un bénévole</template>
    <template #statement>
      <SearchUser v-model="volunteer" :list="addableVolunteers" hide-details />
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Ajouter
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
import type { Mobilization, Volunteer } from "@overbookd/festival-event";
import type { User } from "@overbookd/user";

const userStore = useUserStore();

const props = defineProps({
  mobilization: {
    type: Object as () => Mobilization,
    required: true,
  },
});

const volunteers = computed<User[]>(() => userStore.volunteers);
if (volunteers.value.length === 0) {
  userStore.fetchVolunteers();
}

const volunteer = ref<Volunteer | undefined>();

const addableVolunteers = computed<User[]>(() =>
  volunteers.value.filter(
    (volunteer) =>
      !props.mobilization.volunteers.some((v) => v.id === volunteer.id),
  ),
);

const emit = defineEmits(["add", "close"]);

const addVolunteer = () => {
  if (!volunteer.value || !volunteer.value.id) return;
  const volunteerId = volunteer.value.id;
  emit("add", props.mobilization, volunteerId);
  close();
};
const close = () => {
  emit("close");
  volunteer.value = undefined;
};
</script>

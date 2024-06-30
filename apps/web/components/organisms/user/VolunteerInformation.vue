<template>
  <v-card>
    <VolunteerPersonalDataForm
      v-if="volunteer"
      :volunteer="volunteer"
      @updated="updated"
    />
  </v-card>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

const volunteer = computed(() => userStore.selectedUser);

const emit = defineEmits(["updated"]);

const updated = () => {
  emit("updated");
};
</script>

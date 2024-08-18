<template>
  <div class="permission-form">
    <v-text-field
      v-model="name"
      label="Nom"
      class="permission-form__input"
      hide-details
    />
    <v-text-field
      v-model="description"
      label="Description"
      class="permission-form__input"
      hide-details
    />
    <v-btn
      text="Ajouter une permission"
      color="primary"
      :disabled="canNotCreatePermission"
      @click="createPermission"
    />
  </div>
</template>

<script lang="ts" setup>
const permissionStore = usePermissionStore();

const name = ref<string>("");
const description = ref<string>("");

const canNotCreatePermission = computed<boolean>(() => !name.value.trim());

const createPermission = async () => {
  if (canNotCreatePermission.value) return;

  await permissionStore.createPermission({
    name: name.value,
    description: description.value,
  });
  name.value = "";
  description.value = "";
};
</script>

<style lang="scss" scoped>
.permission-form {
  display: flex;
  gap: 15px;
  align-items: center;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    &__input {
      width: 100%;
    }
  }
}
</style>

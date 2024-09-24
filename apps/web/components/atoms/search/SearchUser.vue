<template>
  <v-autocomplete
    v-model="user"
    :items="userList"
    chips
    :clearable="clearable"
    item-value="id"
    :item-title="buildUserNameWithNickname"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    hide-selected
    :custom-filter="slugifiedFilter"
    no-data-text="Aucun utilisateur correspondant"
  />
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import { slugifiedFilter } from "~/utils/search/search.utils";

const userStore = useUserStore();
userStore.fetchVolunteers();

const user = defineModel<User>({ required: false });

const props = defineProps({
  label: {
    type: String,
    default: "Chercher un utilisateur",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array as PropType<User[] | null>,
    default: () => null,
  },
});

const userList = computed<User[]>(() => props.list ?? userStore.volunteers);
</script>

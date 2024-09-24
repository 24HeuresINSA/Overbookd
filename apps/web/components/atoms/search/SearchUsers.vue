<template>
  <v-autocomplete
    v-model="users"
    :items="userList"
    chips
    multiple
    clear-on-select
    auto-select-first
    item-value="id"
    :item-title="buildUserNameWithNickname"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    :closable-chips="closableChips"
    :custom-filter="slugifiedFilter"
    no-data-text="Aucun utilisateur correspondant"
    @update:model-value="propagateChange"
  />
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import { slugifiedFilter } from "~/utils/search/search.utils";

const userStore = useUserStore();
userStore.fetchVolunteers();

const users = defineModel<User[]>({ default: [] });

const props = defineProps({
  label: {
    type: String,
    default: "Chercher un utilisateur",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  closableChips: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array as PropType<User[] | null>,
    default: () => null,
  },
});

const emit = defineEmits(["add", "remove"]);

const lastUsers = ref<User[]>(users.value);

const userList = computed<User[]>(() => props.list ?? userStore.volunteers);

const propagateChange = (selectedUsers: User[]) => {
  const addedUsers = selectedUsers.filter(
    (user) => !lastUsers.value.some(({ id }) => id === user.id),
  );
  const removedUsers = lastUsers.value.filter(
    (user) => !selectedUsers.some(({ id }) => id === user.id),
  );

  lastUsers.value = selectedUsers;

  addedUsers.forEach((addedUser) => propagateAdd(addedUser));
  removedUsers.forEach((removedUser) => propagateRemove(removedUser));
};
const propagateAdd = (user: User) => emit("add", user);
const propagateRemove = (user: User) => emit("remove", user);
</script>

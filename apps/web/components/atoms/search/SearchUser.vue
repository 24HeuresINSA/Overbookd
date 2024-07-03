<template>
  <v-autocomplete
    v-model="user"
    :items="users"
    chips
    clearable
    item-value="id"
    :item-title="formatUserNameWithNickname"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    :filter="filterUsers"
    no-data-text="Aucun utilisateur correspondant"
  />
</template>

<script lang="ts" setup>
import type { UserPersonalData } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";

const userStore = useUserStore();
userStore.fetchUsers();

const user = defineModel<UserPersonalData | null>({ required: true });

const props = defineProps({
  label: {
    type: String,
    default: "Chercher un utilisateur",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array as () => UserPersonalData[] | null,
    default: () => null,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const users = computed<UserPersonalData[]>(() => props.list ?? userStore.users);

const filterUsers = (
  search: string,
): ((user: Searchable<UserPersonalData>) => boolean) => {
  return keepMatchingSearchCriteria(search);
};
</script>

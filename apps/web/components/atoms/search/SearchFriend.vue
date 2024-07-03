<template>
  <v-autocomplete
    v-model="friend"
    :items="friends"
    clearable
    :item-title="formatUserNameWithNickname"
    item-value="id"
    :label="label"
    :disabled="disabled"
    return-object
    :filter="filterFriends"
    no-data-text="Il ne doit pas encore être inscrit sur le site."
  />
</template>

<script lang="ts" setup>
import type { User } from "@overbookd/user";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

const userStore = useUserStore();

userStore.fetchFriends();

const friend = defineModel<User | null>({ required: true });

const { label, disabled } = defineProps({
  label: {
    type: String,
    default: "Chercher un bénévole",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const friends = computed(() => userStore.friends);

const filterFriends = (
  search: string,
): ((friend: Searchable<User>) => boolean) => {
  return keepMatchingSearchCriteria(search);
};
</script>

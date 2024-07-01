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
import { SlugifyService } from "@overbookd/slugify";
import type { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

const userStore = useUserStore();

if (userStore.friends.length === 0) userStore.fetchFriends();

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

const filterFriends = (friend: User, typedSearch: string) => {
  const { firstname, lastname, nickname } = friend;
  const searchable = `${firstname} ${lastname} ${nickname ?? ""}`;
  const search = SlugifyService.apply(typedSearch);

  return SlugifyService.apply(searchable).includes(search);
};
</script>

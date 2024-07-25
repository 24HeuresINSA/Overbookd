<template>
  <v-autocomplete
    v-model="friend"
    :items="friends"
    :loading="loading"
    clearable
    item-value="id"
    :item-title="formatUserNameWithNickname"
    :label="label"
    :disabled="disabled"
    return-object
    :custom-filter="slugifiedFilter"
    no-data-text="Il ne doit pas encore être inscrit sur le site."
  />
</template>

<script lang="ts" setup>
import type { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { slugifiedFilter } from "~/utils/search/search.utils";

const userStore = useUserStore();

const friends = computed<User[]>(() => userStore.friends);
const loading = ref<boolean>(friends.value.length === 0);
userStore.fetchFriends().then(() => (loading.value = false));

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
</script>

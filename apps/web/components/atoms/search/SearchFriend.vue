<template>
  <v-autocomplete
    v-model="friend"
    :items="potentialFriends"
    :loading="loading"
    clearable
    item-value="id"
    :item-title="buildUserNameWithNickname"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    :custom-filter="slugifiedFilter"
    no-data-text="Il ne doit pas encore être inscrit sur le site."
  />
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import { slugifiedFilter } from "~/utils/search/search.utils";

const userStore = useUserStore();

const potentialFriends = computed<User[]>(() => userStore.potentialFriends);
const loading = ref<boolean>(potentialFriends.value.length === 0);

const friend = defineModel<User | null>({ required: true });

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<User>,
    required: true,
  },
  label: {
    type: String,
    default: "Chercher un bénévole",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => volunteer,
  ({ id }) => {
    loading.value = true;
    userStore.fetchFriendsFor(id).then(() => (loading.value = false));
  },
  { immediate: true },
);
</script>

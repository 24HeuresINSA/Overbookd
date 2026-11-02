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
  >
    <template v-if="withAvatar" #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <UserAvatar
            :picture="item.raw.profilePicture ?? undefined"
            class="mr-3"
          />
        </template>
      </v-list-item>
    </template>
    <template v-if="withAvatar" #chip="{ props: chipProps, item }">
      <v-chip v-bind="chipProps">
        <template #prepend>
          <UserAvatar
            :picture="item.raw.profilePicture ?? undefined"
            :size="20"
            class="mr-2"
          />
        </template>
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import { slugifiedFilter } from "~/utils/search/search.utils";

type SearchableUser = User & { profilePicture?: string | null };

const userStore = useUserStore();

const user = defineModel<SearchableUser>({ required: false });

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
    type: Array as PropType<SearchableUser[] | null>,
    default: () => null,
  },
  withAvatar: {
    type: Boolean,
    default: false,
  },
});

if (!props.list) userStore.fetchVolunteers();

const userList = computed<SearchableUser[]>(
  () => props.list ?? userStore.volunteers,
);
</script>

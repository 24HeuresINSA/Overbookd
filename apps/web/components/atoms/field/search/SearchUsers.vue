<template>
  <v-autocomplete
    :value="users"
    :items="userList"
    :loading="loading"
    chips
    multiple
    item-value="id"
    :item-text="displayUsername"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
    return-object
    :deletable-chips="deletableChips"
    :filter="filterUsers"
    @change="propagateChange"
  >
    <template #no-data>
      <v-list-item> Aucun utilisateur correspondant </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User } from "@overbookd/user";
import { SlugifyService } from "@overbookd/slugify";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

interface SearchUserData {
  loading: boolean;
}

export default defineComponent({
  name: "SearchUsers",
  props: {
    label: {
      type: String,
      default: "Chercher un utilisateur",
    },
    users: {
      type: Array as () => User[],
      default: () => [],
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    deletableChips: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array as () => User[] | null,
      default: () => null,
    },
  },
  data(): SearchUserData {
    return {
      loading: false,
    };
  },
  computed: {
    userList() {
      return this.list || this.$accessor.user.users;
    },
  },
  mounted() {
    if (this.list != null) return;
    this.$accessor.user.fetchUsers();
  },
  methods: {
    propagateChange(users: User[]) {
      this.$emit("change", users);

      const addedUsers = users.filter((user) => !this.users.includes(user));
      const removedUsers = this.users.filter((user) => !users.includes(user));

      addedUsers.forEach((addedUser) => this.propagateAdd(addedUser));
      removedUsers.forEach((removedUser) => this.propagateRemove(removedUser));
    },
    propagateAdd(user: User) {
      this.$emit("add", user);
    },
    propagateRemove(user: User) {
      this.$emit("remove", user);
    },
    displayUsername(user: User): string {
      return formatUserNameWithNickname(user);
    },
    filterUsers(user: User, typedSearch: string) {
      const { firstname, lastname, nickname } = user;
      const searchable = `${firstname} ${lastname} ${nickname ?? ""}`;
      const search = SlugifyService.apply(typedSearch);

      return SlugifyService.apply(searchable).includes(search);
    },
  },
});
</script>

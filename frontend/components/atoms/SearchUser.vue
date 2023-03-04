<template>
  <v-autocomplete
    :value="user"
    :items="users"
    :loading="loading"
    chips
    clearable
    item-value="id"
    :item-text="displayUsername"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
    return-object
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucun utilisateur correspondant </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

interface SearchUserData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchUser",
  model: {
    prop: "user",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher un utilisateur",
    },
    user: {
      type: Object as () => User | null,
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
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
    users() {
      return this.list ?? this.$accessor.user.users;
    },
  },
  mounted() {
    if (this.users.length) return;
    this.$accessor.user.fetchUsers();
  },
  methods: {
    propagateEvent(user: User | null) {
      this.$emit("change", user);
    },
    displayUsername(user: User): string {
      return formatUsername(user);
    },
  },
});
</script>

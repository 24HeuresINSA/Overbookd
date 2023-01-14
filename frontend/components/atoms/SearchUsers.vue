<template>
  <v-autocomplete
    :value="users"
    :items="allUsers"
    :loading="loading"
    chips
    clearable
    multiple
    item-value="id"
    :item-text="displayUsername"
    :label="label"
    :solo="boxed"
    :filled="boxed"
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

interface SearchUserData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchUsers",
  model: {
    prop: "users",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher un utilisateur",
    },
    users: {
      type: Array,
      default: () => [],
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  data(): SearchUserData {
    return {
      loading: false,
    };
  },
  computed: {
    allUsers() {
      return this.$accessor.user.users;
    },
  },
  mounted() {
    if (this.allUsers.length) return;
    this.$accessor.user.fetchUsers();
  },
  methods: {
    propagateEvent(users: User[]) {
      this.$emit("change", users);
    },
    displayUsername({ firstname, lastname }: User): string {
      return `${firstname} ${lastname}`;
    },
  },
});
</script>

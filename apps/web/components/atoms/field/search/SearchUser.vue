<template>
  <v-autocomplete
    :key="counter"
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
    :hide-details="hideDetails"
    return-object
    :filter="filterUsers"
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucun utilisateur correspondant </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { UserPersonalData } from "@overbookd/user";
import { SlugifyService } from "@overbookd/slugify";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

type SearchUserData = {
  loading: boolean;
  counter: number;
};

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
      type: Object as () => UserPersonalData | null,
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
      type: Array as () => UserPersonalData[] | null,
      default: () => null,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  data(): SearchUserData {
    return {
      loading: false,
      counter: 0,
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
    propagateEvent(user: UserPersonalData | null) {
      this.counter += 1;
      this.$emit("change", user);
    },
    displayUsername(user: UserPersonalData): string {
      return formatUserNameWithNickname(user);
    },
    filterUsers(user: UserPersonalData, typedSearch: string) {
      const { firstname, lastname, nickname } = user;
      const searchable = `${firstname} ${lastname} ${nickname ?? ""}`;
      const search = SlugifyService.apply(typedSearch);

      return SlugifyService.apply(searchable).includes(search);
    },
  },
});
</script>

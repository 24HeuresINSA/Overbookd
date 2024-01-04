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
import { User, UserPersonalData } from "@overbookd/user";
import { SlugifyService } from "@overbookd/slugify";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

interface SearchUserData {
  loading: boolean;
}

type SearchUser = UserPersonalData | User;

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
      type: Object as () => SearchUser | null,
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
      type: Array as () => SearchUser[] | null,
      default: null,
    },
    nobodyField: {
      type: Boolean,
      default: false,
    },
  },
  data(): SearchUserData {
    return {
      loading: false,
    };
  },
  computed: {
    users(): SearchUser[] {
      const list = this.list ?? this.$accessor.user.users;
      const nobody: User = { id: -1, firstname: "Aucun", lastname: "" };
      return this.nobodyField ? [nobody, ...list] : list;
    },
  },
  mounted() {
    if (this.users.length) return;
    this.$accessor.user.fetchUsers();
  },
  methods: {
    propagateEvent(user: SearchUser | null) {
      this.$emit("change", user);
    },
    displayUsername(user: SearchUser): string {
      return formatUserNameWithNickname(user);
    },
    filterUsers(user: SearchUser, typedSearch: string) {
      const { firstname, lastname, nickname } = user;
      const searchable = `${firstname} ${lastname} ${nickname ?? ""}`;
      const search = SlugifyService.apply(typedSearch);

      return SlugifyService.apply(searchable).includes(search);
    },
  },
});
</script>

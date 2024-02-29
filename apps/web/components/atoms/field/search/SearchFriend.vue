<template>
  <v-autocomplete
    :value="friend"
    :items="friends"
    :loading="loading"
    clearable
    item-value="id"
    :item-text="displayUsername"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
    return-object
    :filter="filterFriends"
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item>
        Il ne doit pas encore être inscrit sur le site.
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { SlugifyService } from "@overbookd/slugify";

interface SearchFriendData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchFriend",
  model: {
    prop: "friend",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher un bénévole",
    },
    friend: {
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
  },
  data(): SearchFriendData {
    return {
      loading: false,
    };
  },
  computed: {
    friends(): User[] {
      return this.$accessor.user.friends;
    },
  },
  mounted() {
    if (this.friends.length) return;
    this.$accessor.user.fetchFriends();
  },
  methods: {
    propagateEvent(friend: User | null) {
      this.$emit("change", friend);
    },
    displayUsername(friend: User): string {
      return formatUserNameWithNickname(friend);
    },
    filterFriends(friend: User, typedSearch: string) {
      const { firstname, lastname, nickname } = friend;
      const searchable = `${firstname} ${lastname} ${nickname ?? ""}`;
      const search = SlugifyService.apply(typedSearch);

      return SlugifyService.apply(searchable).includes(search);
    },
  },
});
</script>

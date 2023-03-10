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
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucun bénévole correspondant </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { Friend } from "~/utils/models/user";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";

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
      type: Object as () => Friend | null,
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
    friends() {
      return this.$accessor.user.friends;
    },
  },
  mounted() {
    if (this.friends.length) return;
    this.$accessor.user.fetchFriends();
  },
  methods: {
    propagateEvent(friend: Friend | null) {
      this.$emit("change", friend);
    },
    displayUsername(friend: Friend): string {
      return formatUserNameWithNickname(friend);
    },
  },
});
</script>

<template>
  <v-card
    v-if="me"
    height="100%"
    class="d-flex flex-column justify-space-between"
  >
    <div>
      <v-card-title>Amis ❤️</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item-group>
            <v-list-item v-for="(friend, index) in mFriends" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  {{ displayFriend(friend) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-container v-if="!mFriends.length">
          <v-img
            src="https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif"
          ></v-img>
          <p>
            Pour demander un orga en ami, mets le prénom, nom de tes potes !
          </p>
        </v-container>
      </v-card-text>
    </div>
    <v-card-actions class="friend-search">
      <SearchFriend v-model="newFriend" class="friend-search__input" />
      <v-btn text class="friend-search__action" @click="sendFriendRequest">
        demander en ami
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFriend from "~/components/atoms/SearchFriend.vue";
import { Friend } from "~/utils/models/user";
import { formatFriendName } from "~/utils/user/userUtils";

interface FriendsCardData {
  newFriend: Friend;
}

export default Vue.extend({
  name: "FriendsCard",
  components: {
    SearchFriend,
  },
  data(): FriendsCardData {
    return {
      newFriend: {
        id: 0,
        firstname: "",
        lastname: "",
      },
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
    mFriends(): Friend[] {
      return this.$accessor.user.mFriends;
    },
  },
  async mounted() {
    await this.$accessor.user.fetchMyFriends();
  },
  methods: {
    async sendFriendRequest() {
      if (+this.me.id === this.newFriend.id) {
        // asked himself to be friend
        window.open(
          "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690"
        );
        return;
      }
      this.$accessor.user.addFriend(this.newFriend);
    },
    displayFriend(friend: Friend): string {
      return formatFriendName(friend);
    },
  },
});
</script>

<style lang="scss" scoped>
.friend-search {
  display: flex;
  flex-direction: column;
  &__input {
    width: 90%;
  }
}
</style>

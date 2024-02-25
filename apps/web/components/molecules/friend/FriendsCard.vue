<template>
  <v-card height="100%" class="d-flex flex-column justify-space-between">
    <div>
      <v-card-title>Amis ❤️</v-card-title>
      <v-card-text class="friends-card__content">
        <v-list dense class="friends-list">
          <v-list-item-group>
            <v-list-item v-for="(friend, index) in myFriends" :key="index">
              <v-list-item-content>
                {{ displayFriend(friend) }}
              </v-list-item-content>
              <v-list-item-action>
                <v-icon @click="removeFriend(friend)">mdi-close</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-container v-if="myFriends.length === 0">
          <v-img
            src="https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif"
            class="mb-2"
          ></v-img>
          <p class="text-justify">
            N'hésites pas à demander d'autres bénévoles en ami !
          </p>
          <p class="text-justify">
            Si tu ne trouves pas son nom, alors il n'est pas encore inscrit sur
            le site.
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
import SearchFriend from "~/components/atoms/field/search/SearchFriend.vue";
import { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

interface FriendsCardData {
  newFriend: User;
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
    myFriends(): User[] {
      return this.$accessor.user.mFriends;
    },
  },
  async mounted() {
    await this.$accessor.user.fetchMyFriends();
  },
  methods: {
    async sendFriendRequest() {
      if (!this.newFriend.id) return;
      const isAskingHimSelf = this.me.id === this.newFriend.id;
      if (isAskingHimSelf) {
        // asked himself to be friend
        window.open(
          "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690",
        );
        return;
      }
      this.$accessor.user.addFriend(this.newFriend);
      this.newFriend = {
        id: 0,
        firstname: "",
        lastname: "",
      };
    },
    displayFriend(friend: User): string {
      return formatUserNameWithNickname(friend);
    },
    removeFriend(friend: User) {
      this.$accessor.user.removeFriend(friend);
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

.friends-card__content,
.friends-list {
  padding-top: 0;
  padding-bottom: 0;
}

.text-justify {
  text-align: justify;
}
</style>

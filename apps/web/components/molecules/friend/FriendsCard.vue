<template>
  <v-card class="friends-card">
    <v-card-title>Amis ❤️</v-card-title>
    <v-card-subtitle>
      Nous ferons notre maximum pour que vous soyez ensemble pendant vos
      créneaux.
    </v-card-subtitle>
    <v-card-text class="friends-card__content">
      <img :src="image.link" :alt="image.description" />
      <div class="friends-management">
        <ul class="friends-list">
          <li v-for="(friend, index) in myFriends" :key="index" class="friend">
            <span class="name">{{ displayFriend(friend) }}</span>
            <v-btn icon @click="removeFriend(friend)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </li>
          <SearchFriend
            v-model="newFriend"
            class="friend-search"
            @change="sendFriendRequest"
          />
        </ul>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFriend from "~/components/atoms/field/search/SearchFriend.vue";
import { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

interface FriendsCardData {
  newFriend: User | null;
}

type Image = {
  link: string;
  description: string;
};

const alone: Image = {
  link: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
  description: "Sans aucun amis",
};

const friendship: Image = {
  link: "https://media2.giphy.com/media/BIA2rRLTq0ibe/giphy.gif?cid=ecf05e472yvzffzma8wziiay5p05ow11knrlj7ecwvzdckyg&ep=v1_gifs_related&rid=giphy.gif&ct=g",
  description: "Avec quelques amis",
};

const howToMakeFriends =
  "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690";

export default Vue.extend({
  name: "FriendsCard",
  components: {
    SearchFriend,
  },
  data(): FriendsCardData {
    return {
      newFriend: null,
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
    myFriends(): User[] {
      return this.$accessor.user.mFriends;
    },
    image(): Image {
      return this.myFriends.length > 0 ? friendship : alone;
    },
  },
  async mounted() {
    await this.$accessor.user.fetchMyFriends();
  },
  methods: {
    async sendFriendRequest() {
      if (this.newFriend === null) return;
      const isAskingHimSelf = this.me.id === this.newFriend.id;
      if (isAskingHimSelf) {
        window.open(howToMakeFriends);
        return;
      }
      this.$accessor.user.addFriend(this.newFriend);
      this.newFriend = { id: 0, firstname: "", lastname: "" };
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
.friends-card {
  padding: 0;
  &__content {
    display: flex;
    gap: 20px;
    .friends-management {
      display: flex;
      gap: 5px;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
    }
    .friends-list {
      padding: unset;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 300px));
      gap: 0px 10px;
      width: 100%;
    }
    .friend-search {
      margin-top: 10px;
      grid-column: 1 / span 1;
    }

    .friend {
      padding: 0px 0px 0px 10px;
      list-style: none;
      color: black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      place-self: center stretch;
      .name {
        text-overflow: ellipsis;
      }
    }
    @media screen and (max-width: $mobile-max-width) {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-direction: column;
      .friends-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      img {
        max-width: 100%;
      }
      .friend,
      .friend-search {
        min-width: 100%;
      }
    }
  }
}
</style>

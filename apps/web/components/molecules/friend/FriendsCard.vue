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
            <span class="name">{{ formatUserNameWithNickname(friend) }}</span>
            <v-btn
              density="compact"
              icon="mdi-close"
              variant="flat"
              @click="removeFriend(friend)"
            />
          </li>
          <SearchFriend
            v-model="newFriend"
            class="friend-search"
            @update:model-value="sendFriendRequest"
          />
        </ul>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

const userStore = useUserStore();

userStore.fetchMyFriends();

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

const newFriend = ref<User | null>(null);

const loggedUser = computed(() => userStore.loggedUser);
const myFriends = computed(() => userStore.mFriends);
const image = computed(() => (myFriends.value.length > 0 ? friendship : alone));

const sendFriendRequest = async () => {
  if (newFriend.value === null) return;
  const isAskingHimSelf = loggedUser.value?.id === newFriend.value.id;
  if (isAskingHimSelf) {
    window.open(howToMakeFriends);
    return;
  }
  userStore.addFriend(newFriend.value);
  newFriend.value = null;
};
const removeFriend = (friend: User) => userStore.removeFriend(friend);
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
      gap: 10px;
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

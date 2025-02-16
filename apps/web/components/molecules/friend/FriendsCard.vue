<template>
  <v-card class="friends-card">
    <v-card-title class="friends-card__title">
      <span>❤️ Amis </span>
    </v-card-title>
    <v-card-text class="friends-card__text">
      Nous ferons notre maximum pour que vous soyez ensemble pendant vos
      créneaux.
    </v-card-text>
    <v-card-text class="friends-card__content">
      <v-row>
        <v-col justify="start" flex-wrap="wrap">
          <img :src="image.link" :alt="image.description" flex-wrap="wrap" />
        </v-col>
        <v-col cols="auto" flex-wrap="wrap">
          <div class="friends-management" flex-wrap="wrap">
            <div class="friends-list">
              <SearchFriend
                v-model="newFriend"
                class="friend-search"
                @update:model-value="sendFriendRequest"
              />
              <v-list v-for="(friend, index) in myFriends" :key="index" class="friend" elevation="2">
                <span class="name">{{ buildUserNameWithNickname(friend) }}</span>
                <v-btn
                  density="compact"
                  icon="mdi-close"
                  variant="flat"
                  color="secondary"
                  @click="removeFriend(friend)"
                />
              </v-list>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";

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
  min-width: 280px;
  width: 100%;
  height: fit-content;

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
    padding-bottom: 0;
  }

  &__text {
    font-size: 0.9rem;
    margin: 10px 1px;
    opacity: 0.7;
    text-align: start;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: start;
    gap: 20px;

    .friends-management {
      display: flex;
      gap: 5px;
      align-items: flex-start;
      flex-direction: column;
    }

    .friends-list {
      padding: unset;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 300px));
      gap: 10px;
    }

    .friend-search {
      margin-top: 10px;
      grid-column: 1 / span 1;
    }

    .friend {
      opacity: 0.8;
      color: rgb(var(--v-theme-text));
      padding: 5px 5px 5px 10px;
      list-style: none;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      place-self: center stretch;
      min-width: 100px;
      width: auto;

      .name {
        text-overflow: ellipsis;
      }
    }

    img {
      max-width: 100%;
      border-radius: 10px;
      min-width: 200px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

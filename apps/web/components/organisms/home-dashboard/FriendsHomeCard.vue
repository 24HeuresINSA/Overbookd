<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>mdi-heart</v-icon>
      <span>Ami·e·s </span>
    </v-card-title>
    <v-card-text class="home-card__content">
      <p class="description">
        Nous ferons notre maximum pour que vous soyez ensemble pendant vos
        créneaux.
      </p>

      <div>
        <v-col justify="start" class="cols">
          <img :src="image.link" :alt="image.description" />
        </v-col>
        <v-col cols="auto" class="cols">
          <div class="friends">
            <SearchFriend
              v-model="newFriend"
              class="friends-list__search"
              hide-details
              @update:model-value="sendFriendRequest"
            />
            <v-list
              v-for="(friend, index) in myFriends"
              :key="index"
              class="friends__item"
              elevation="2"
            >
              <span class="name">
                {{ buildUserNameWithNickname(friend) }}
              </span>
              <v-btn
                density="compact"
                icon="mdi-close"
                aria-label="Retirer l'ami"
                title="Retirer l'ami :'("
                variant="flat"
                color="secondary"
                @click="removeFriend(friend)"
              />
            </v-list>
          </div>
        </v-col>
      </div>
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
const myFriends = computed(() => userStore.myFriends);
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
@use "./home-dashboard.scss" as *;

.friends {
  display: grid;
  grid-template-columns: minmax(200px, 800px);
  gap: 10px;
  margin: 0 5px 5px 10px;
  &__search {
    min-width: 100px;
    width: auto;
    margin-bottom: 10px;
    grid-column: 1 / span 1;
  }
  &__item {
    opacity: 0.9;
    padding: 5px 5px 5px 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.description {
  margin-bottom: 10px;
  font-size: 0.9rem;
  margin: 10px 1rem;
}

img {
  max-width: 100%;
  min-width: 100px;
  width: auto;
  border-radius: 10px;
  margin: 0 5px 10px 5px;
}

.cols {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 5px;
}
</style>

<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>mdi-heart</v-icon>
      <span>Ami·e·s</span>
    </v-card-title>
    <v-card-text class="home-card__content friends">
      <p class="friends__description">
        Nous ferons notre maximum pour que vous soyez ensemble pendant vos
        créneaux.
      </p>

      <img :src="image.link" :alt="image.description" class="friends__gif" />

      <SearchFriend
        v-if="loggedUser"
        v-model="newFriend"
        :volunteer="loggedUser"
        prepend-inner-icon="mdi-account-plus"
        hide-details
        @update:model-value="sendFriendRequest"
      />

      <v-list
        v-if="myFriends.length > 0"
        density="compact"
        class="friends__list"
      >
        <v-list-item
          v-for="friend in myFriends"
          :key="friend.id"
          class="friends__item"
          rounded="lg"
          :link="canViewFriendDetails"
          @click="openFriendDialog(friend)"
        >
          <template #prepend>
            <UserAvatar :picture="friend.profilePicture ?? undefined" />
          </template>
          <v-list-item-title>
            {{ buildUserNameWithNickname(friend) }}
          </v-list-item-title>
          <template #append>
            <v-btn
              icon="mdi-close"
              size="small"
              variant="text"
              class="friends__remove"
              aria-label="Retirer l'ami·e"
              title="Retirer l'ami·e :'("
              @click.stop="removeFriend(friend)"
            />
          </template>
        </v-list-item>
      </v-list>
      <span v-else class="no-content-label">
        Tu n'as pas encore d'ami·e 🥲<br />
        Cherche un·e bénévole pour l'ajouter !
      </span>
    </v-card-text>

    <v-dialog
      v-model="isFriendDialogOpen"
      :width="canAssignVolunteer ? 1400 : 700"
    >
      <VolunteerInformationDialogCard
        v-if="selectedFriend"
        :volunteer="selectedFriend"
        @updated="closeFriendDialog"
        @close="closeFriendDialog"
      />
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import {
  AFFECT_VOLUNTEER,
  VIEW_VOLUNTEER_DETAILS,
} from "@overbookd/permission";

const myStore = useMyStore();
const userStore = useUserStore();
const availabilityStore = useVolunteerAvailabilityStore();

userStore.fetchMyFriends();

type Image = {
  link: string;
  description: string;
};

const alone: Image = {
  link: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
  description: "Sans aucun·e ami·e",
};

const friendship: Image = {
  link: "https://media2.giphy.com/media/BIA2rRLTq0ibe/giphy.gif?cid=ecf05e472yvzffzma8wziiay5p05ow11knrlj7ecwvzdckyg&ep=v1_gifs_related&rid=giphy.gif&ct=g",
  description: "Avec quelques ami·e·s",
};

const howToMakeFriends =
  "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690";

const newFriend = ref<User | null>(null);

const loggedUser = computed(() => myStore.loggedUser);
const myFriends = computed(() => userStore.myFriends);
const image = computed(() => (myFriends.value.length > 0 ? friendship : alone));

const sendFriendRequest = () => {
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

const canViewFriendDetails = computed<boolean>(() =>
  myStore.can(VIEW_VOLUNTEER_DETAILS),
);
const canAssignVolunteer = computed<boolean>(() =>
  myStore.can(AFFECT_VOLUNTEER),
);

const selectedFriend = computed(() => userStore.selectedUser);
const isFriendDialogOpen = ref<boolean>(false);
const openFriendDialog = async (friend: User) => {
  if (!canViewFriendDetails.value) return;
  await userStore.findUserById(friend.id);
  if (selectedFriend.value?.id !== friend.id) return;
  if (canAssignVolunteer.value) {
    availabilityStore.fetchVolunteerAvailabilities(friend.id);
  }
  isFriendDialogOpen.value = true;
};
const closeFriendDialog = () => (isFriendDialogOpen.value = false);
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.friends {
  gap: 12px;
  padding: 10px 16px 16px;

  &__description {
    font-size: 0.9rem;
  }

  &__gif {
    align-self: center;
    max-width: 100%;
    max-height: 220px;
    border-radius: 10px;
  }

  &__list {
    padding: 0;
    max-height: 360px;
    overflow-y: auto;
  }

  &__item {
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(var(--v-theme-secondary), 0.15);
    }
  }

  &__remove:hover {
    color: rgb(var(--v-theme-error));
  }
}
</style>

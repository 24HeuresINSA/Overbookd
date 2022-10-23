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
            <v-list-item v-for="(item, index) in me.friends" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ item.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-container v-if="!me.friends || !me.friends.length">
          <v-img
            src="https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif"
          ></v-img>
          <p>Pour demander un orga en ami, mets le prénom.nom de tes potes !</p>
        </v-container>
      </v-card-text>
    </div>
    <v-card-actions class="d-flex flex-column align-start">
      <v-autocomplete
        v-model="newFriend"
        label="prénom.nom de ton pote"
        :items="usernames"
        class="mx-2"
      ></v-autocomplete>
      <v-btn text @click="sendFriendRequest">demander en ami</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import { FriendRequest } from "~/utils/models/repo";
import { SnackNotif } from "../../utils/models/store";

export default Vue.extend({
  name: "FriendsCard",
  data() {
    return {
      newFriend: {
        id: "",
        username: "",
      },
      usernames: undefined,
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
  },
  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsers(this)
    );
    if (res) {
      this.usernames = res.data
        .map((user: any) => {
          if (!user.team.includes("hard")) {
            const username = user.firstname + " " + user.lastname;
            return { text: username, value: user };
          }
        })
        .filter((item: any) => item);
    }
  },
  methods: {
    async sendFriendRequest() {
      if (this.me.id === this.newFriend.id) {
        // asked himself to be friend
        window.open(
          "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690"
        );
        return;
      }
      if (this.me.friends.find((friend) => friend.id === this.newFriend.id)) {
        const notif: SnackNotif = {
          type: "success",
          message: "Vous êtes déjà amis !",
        };
        this.$store.dispatch("notif/pushNotification", notif);
        return;
      }
      // generate a new friend request
      let req: FriendRequest = {
        type: "friendRequest",
        message: `${this.me.firstname}.${this.me.lastname} vous a envoyé une demande d'ami ❤️`,
        from: `${this.me.nickname ? this.me.nickname : this.me.lastname}`,
        date: new Date(),
        data: {
          username: `${this.me.firstname} ${this.me.lastname.toUpperCase()}`,
          id: this.me.id,
        },
      };
      // Send it to the api
      await safeCall(
        this.$store,
        RepoFactory.userRepo.sendFriendRequestByKeycloakID(this, {
          to: this.newFriend.id,
          data: req,
        }),
        "sent",
        "server"
      );
    },
  },
});
</script>

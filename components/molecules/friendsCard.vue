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
          <p>
            Pour demander un orga (ou un soft) en ami, mets le prénom.nom de tes
            potes !
          </p>
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

export default Vue.extend({
  name: "FriendsCard",
  data() {
    return {
      newFriend: "",
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
      RepoFactory.get("user").getAllUsernames(this)
    );
    if (res) {
      this.usernames = res.data;
    }
  },
  methods: {
    async sendFriendRequest() {
      //retrieve first and lastname
      let [firstname, lastname] = this.newFriend.split(".");
      if (firstname === this.me.firstname && lastname === this.me.lastname) {
        // asked himself to be friend
        window.open(
          "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690"
        );
        return;
      }
      if (
        this.me.friends.find((friend) => friend.username === this.newFriend)
      ) {
        // already friends
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Vous êtes déjà amis...",
        });
      }
      // generate a new friend request
      let req: FriendRequest = {
        type: "friendRequest",
        message: `${this.me.firstname}.${this.me.lastname} vous a envoye une demande d'ami ❤️`,
        from: `${this.me.nickname ? this.me.nickname : this.me.lastname}`,
        date: new Date(),
        data: {
          username: `${this.me.firstname}.${this.me.lastname}`,
          id: this.me._id,
        },
      };
      // Send it to the api
      await safeCall(
        this.$store,
        RepoFactory.get("user").sendFriendRequest(this, {
          to: { firstname, lastname },
          data: req,
        }),
        "sent",
        "server"
      );
    },
  },
});
</script>

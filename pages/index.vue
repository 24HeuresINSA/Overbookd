<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="6" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Bonsoir {{ user.nickname ? user.nickname : user.firstname }}</v-card-title>
            <v-card-subtitle>👋 {{ user.firstname }}.{{ user.lastname }}</v-card-subtitle>
            <v-card-text>
              <h3>📩 {{ user.email }}</h3>
              <h3>📞 {{ user.phone }}</h3>
              <h3>😎 {{ user.charisma || 0 }} charisme</h3>
              <h3>❤️ {{ user.friends ? user.friends.length : 0}} amis</h3>
              <h3>📆 {{ (new Date(user.birthday)).toLocaleString()}}</h3>
              <h3>🗣 {{ user.assigned ? user.assigned.length : 0 }} taches affectés</h3>
              <h3>🚗 {{ user.hasDriverLicense ? '✅' : '🛑' }}</h3>

              <over-chips :roles="user.team"></over-chips>

              <v-progress-linear :value="user.charisma"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="4" md="4" v-if="hasRole('hard')">
          <v-card v-if="user">
            <v-card-title>Compte perso 💰</v-card-title>
            <v-card-subtitle>Balance: {{ user.balance || 0 }} €</v-card-subtitle>
            <v-card-text v-if="user.transactionHistory">
              <v-simple-table>
                <thead>
                <tr>
                  <th class="text-left">
                    Operation
                  </th>
                  <th class="text-right">
                    €
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in user.transactionHistory"
                >
                  <td>{{ item.reason }}</td>
                  <td class="text-right">{{ item.amount }} €</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="4" md="4">
          <v-card v-if="user">
            <v-card-title>Amis ❤️</v-card-title>
            <v-card-subtitle>mes reuf</v-card-subtitle>
            <v-card-text v-if="user.friends.length !== 0">
              <v-simple-table>
                <thead>
                <tr>
                  <th class="text-left">
                    Amis
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in user.friends"
                >
                  <td>{{ item.username ? item.username : item }}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-text v-else>
              <h2>Lonely 🥲</h2>
              <p>pour demander en amis met le prenom.nom de tes potes</p>
            </v-card-text>
            <v-card-actions>
              <v-text-field
                  label="username de ton pote"
                  v-model="newFriend"
              ></v-text-field>
              <v-btn text @click="sendFriendRequest">ajouter un amis</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="6" sm="4" md="6">
          <v-card v-if="user">
            <v-card-title>Notification 📣️</v-card-title>
            <v-card-text v-if="user.notifications">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                    </th>
                    <th class="text-left">
                      Message
                    </th>
                    <th class="text-left">
                      Action
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="notification in user.notifications"
                      :key="notification.date"
                  >
                    <td>{{ notification.type === 'friendRequest' ? '👨‍👩‍👧' : '📣' }}</td>
                    <td>{{ notification.message }}</td>
                    <td v-if="notification.type === 'friendRequest'"
                        style="display: flex; justify-content: space-between">
                      <v-btn @click="acceptFriendRequest(notification)">
                        <v-icon>mdi-account-check</v-icon>
                      </v-btn>
                      <v-btn @click="refuseFriendRequest(notification)">
                        <v-icon>mdi-account-cancel</v-icon>
                      </v-btn>
                    </td>
                    <td v-else-if="notification.type === 'broadcast'">
                      <v-btn :href="notification.link">
                        <v-icon>mdi-link</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-card-actions>
                <v-btn @click="isBroadcastDialogOpen = true">broadcast</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="4" md="4">
          <v-card v-if="user">
            <v-img src="https://64.media.tumblr.com/d238e0f637b17270021e457ace270453/b687e7a3a938ff5d-16/s540x810/12568a11bd04c2b5c7a26c17632f32387ecfc0bb.gifv"></v-img>
            <v-card-title>Le Clicker ⏱</v-card-title>
            <v-card-subtitle>Le compteur de blague qui derrape 🚗</v-card-subtitle>
            <v-card-text>
              <h2>Le drift counter</h2>
              <h3>tu es a 10 click 🚗</h3>
            </v-card-text>
            <v-card-actions>
              <v-text-field
                  label="username de ton pote"
              ></v-text-field>
              <v-btn @click="">click</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>
    </v-container>

    <v-snackbar
        v-model="isSnackbarOpen"
        :timeout="5000"
    >
      {{snackbarMessage}}
    </v-snackbar>

    <v-dialog v-model="isBroadcastDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Envoyer un message a l'asso</v-card-title>
        <v-card-text>
          <v-text-field label="lien" v-model="notification.link"></v-text-field>
          <v-text-field label="message" v-model="notification.message"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="broadcast">📣</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="hasNotBeenApproved" max-width="600" persistent>
      <v-card>
        <v-card-title>Oupsss</v-card-title>
        <v-card-text>
          Merci de rejoindre l'asso mais ton compte n'est pas encore activer...
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import { getUser, hasRole } from "../common/role";
import OverChips from "../components/overChips";

export default {
  components: {OverChips},

  data() {
    return {
      user: undefined,
      newFriend: undefined,
      isSnackbarOpen: false,
      isBroadcastDialogOpen: false,
      hasNotBeenApproved:false,
      snackbarMessage: "",
      snackbarMessages: {
        friendRequest: {
          sent: "votre demande d'ami a ete envoye",
          accepted: "T'as un nouveau ami",
          refused: "je suis d'accord c'est un batard",
        },
        error: "🥵 sheeshh une erreur ",
        broadcasted: "broadcast envoyé 📣"
      },
      notification: {
        link: undefined,
        message: undefined
      },
    }
  },

  async mounted() {
    this.user = await getUser(this);

    if (this.user.team === undefined || this.user.team.length === 0){
      this.hasNotBeenApproved = true;
    }
  },

  methods: {
    async broadcast() {
      this.notification.date = new Date();
      this.notification.type = 'broadcast';
      await this.$axios.post('/user/broadcast', this.notification);
      this.snackbarMessage = this.snackbarMessages.broadcasted;
      this.isSnackbarOpen = true;
      this.isBroadcastDialogOpen = false;
    },

    hasRole(team){
      return hasRole(this, team)
    },

    async sendFriendRequest() {
      let [firstname, lastname] = this.newFriend.split('.');
      await this.$axios.put(`/user/notification/${lastname}/${firstname}`, {
        type: 'friendRequest',
        message: `${getUser(this).lastname} ${getUser(this).firstname} vous a envoye une demande d'ami ❤️`,
        from: `${getUser(this).nickname ? getUser(this).nickname : getUser(this).lastname}`,
        date: new Date(),
        data: { username : `${getUser(this).lastname}.${getUser(this).firstname}`, keycloakID: getUser(this).keycloakID }
      })
      this.snackbarMessage = this.snackbarMessages.friendRequest.sent;
      this.isSnackbarOpen = true;
    },

    async acceptFriendRequest(notification) {
      if(notification.data) {
        let friends;
        let user = getUser(this);
        if (user.friends === undefined) {
          friends = []
        } else {
          friends = user.friends
        }
        friends.push(notification.data);
        user.notifications.pop();
        await this.$axios.put(`/user/${user.keycloakID}`,user);
        this.snackbarMessage = this.snackbarMessages.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.snackbarMessages.error;
        this.isSnackbarOpen = true;
      }
    },

    async refuseFriendRequest(notification) {
      if(notification.data) {
        let friends;
        let user = getUser(this);
        if (user.friends === undefined) {
          friends = []
        } else {
          friends = user.friends
        }
        user.notifications.pop();
        await this.$axios.put(`/user/${user.keycloakID}`,user);
        this.snackbarMessage = this.snackbarMessages.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.snackbarMessages.error;
        this.isSnackbarOpen = true;
      }
    }
  },

};
</script>
<style>

</style>
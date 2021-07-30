<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="6" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Bonsoir {{ user.nickname ? user.nickname : user.firstname }}</v-card-title>
            <v-card-subtitle> {{ user.email }}</v-card-subtitle>
            <v-card-text>
              <p>Charisme: {{ user.charisma }}</p>
              <v-chip-group>
                <v-chip v-for="team in user.team">
                  {{ team }}
                </v-chip>
              </v-chip-group>
              <v-progress-linear value="15"></v-progress-linear>
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
              <p>{{ user.friends }}</p>
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
                  <td>{{ item }}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-text v-else>Lonely 🥲</v-card-text>
            <v-card-actions>
              <v-text-field
                  label="username de ton pote"
                  v-model="newFriend"
              ></v-text-field>
              <v-btn @click="sendFriendRequest">ajouter un amis</v-btn>
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
            <v-img src="/cerise.png"></v-img>
            <v-card-title>Le Clicker ⏱</v-card-title>
            <v-card-subtitle>Le compteur de blague qui derrape 🚗</v-card-subtitle>
            <v-card-text>
              <h2>Le drift counter</h2>
              <h3>tu es a 10 click 🚗</h3>
            </v-card-text>
            <v-card-actions>
              <v-text-field
                  label="username de ton pote"
                  v-model="newFriend"
              ></v-text-field>
              <v-btn @click="sendFriendRequest">click</v-btn>
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
  </div>
</template>


<script>
import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
  components: {},

  data() {
    return {
      user: undefined,
      newFriend: undefined,
      isSnackbarOpen: false,
      isBroadcastDialogOpen: false,
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
    this.user = await this.getUser();
  },

  methods: {
    getUser() {
      return this.$store.state.user.data
    },

    hasRole(role) {
      const teams = this.getUser()?.team;
      if (teams === undefined) {
        return false
      }
      return teams.includes(role);
    },

    async broadcast() {
      this.notification.date = new Date();
      this.notification.type = 'broadcast';
      console.log(this.notification);
      await this.$axios.post('/user/broadcast', this.notification);
      this.snackbarMessage = this.snackbarMessages.broadcasted;
      this.isSnackbarOpen = true;
    },

    async sendFriendRequest() {
      let [firstname, lastname] = this.newFriend.split('.');
      await this.$axios.put(`/user/notification/${lastname}/${firstname}`, {
        type: 'friendRequest',
        message: `${this.getUser().lastname} ${this.getUser().firstname} vous a envoye une demande d'ami ❤️`,
        from: `${this.getUser().nickname ? this.getUser().nickname : this.getUser().lastname}`,
        date: new Date(),
        data: `${this.getUser().lastname}.${this.getUser().firstname}`
      })
      this.snackbarMessage = this.snackbarMessages.friendRequest.sent;
      this.isSnackbarOpen = true;
    },

    async acceptFriendRequest(notification) {
      if(notification.data) {
        let friends;
        let user = this.getUser();
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
        let user = this.getUser();
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
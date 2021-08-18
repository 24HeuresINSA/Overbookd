<template>
  <div>
    <v-container  no-gutters>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-img v-if="user.pp" :src=" ( getPPUrl() ) +  'api/user/pp/' + user.pp"></v-img>
            <v-card-title>Bonsoir {{ user.nickname ? user.nickname : user.firstname }}</v-card-title>
            <v-card-subtitle>👋 {{ user.firstname }}.{{ user.lastname }}</v-card-subtitle>
            <v-card-text>
              <h3>📩 {{ user.email }}</h3>
              <h3>📞 {{ user.phone }}</h3>
              <h3>😎 {{ user.charisma || 0 }} charisme</h3>
              <h3>❤️ {{ user.friends ? user.friends.length : 0}} amis</h3>
              <h3>📆 {{ (new Date(user.birthdate)).toLocaleString()}}</h3>
              <h3>🗣 {{ user.assigned ? user.assigned.length : 0 }} taches affectés</h3>
              <h3>🚗 {{ user.hasDriverLicense ? '✅' : '🛑' }}</h3>

              <over-chips :roles="user.team"></over-chips>

              <v-progress-linear :value="user.charisma"></v-progress-linear>
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="isPPDialogOpen = true">📸</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4" md="6">
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
                      v-for="(notification, index) in user.notifications"
                      v-bind:key="notification.date"
                  >
                    <td>{{ notification.type === 'friendRequest' ? '👨‍👩‍👧' : '📣' }}</td>
                    <td>{{ notification.message }}</td>
                    <td v-if="notification.type === 'friendRequest'"
                        style="display: flex; justify-content: space-between">
                      <v-btn icon small @click="acceptFriendRequest(notification)">
                        <v-icon>mdi-account-check</v-icon>
                      </v-btn>
                      <v-btn icon small  @click="refuseFriendRequest(notification)">
                        <v-icon>mdi-account-cancel</v-icon>
                      </v-btn>
                    </td>
                    <td v-else-if="notification.type === 'broadcast'">
                      <v-btn  icon   :href="notification.link">
                        <v-icon>mdi-link</v-icon>
                      </v-btn>
                      <v-btn  icon   @click="deleteNotification(index)">
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-card-actions>
                <v-btn text @click="isBroadcastDialogOpen = true">broadcast</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" v-if="hasRole('hard')">
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
                    v-bind:key="item"
                >
                  <td>{{ item.reason }}</td>
                  <td class="text-right">{{ item.amount }} €</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Amis ❤️</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item v-for="item in user.friends" v-bind:key="item.username">
                    <v-list-item-content>
                      <v-list-item-title>{{item.username}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-container v-if="!user.friends || !user.friends.length">
                <v-img src="https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif"></v-img>
                <p>pour demander en amis met le prenom.nom de tes potes puis a</p>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-text-field
                  label="prénom.nom de ton pote"
                  v-model="newFriend"
              ></v-text-field>
              <v-btn text @click="sendFriendRequest">demander en ami</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-img src="https://media.giphy.com/media/WJZbQEoljvfxK/giphy.gif"></v-img>
            <v-card-title>Le Clicker ⏱</v-card-title>
            <v-card-subtitle>Le compteur de blague qui derrape 🚗</v-card-subtitle>
            <v-card-text>
              <h2>{{user.clicks || 0}} 🚗</h2>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="clicker()">click</v-btn>
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
        <v-card-actions>
          <v-btn text @click="logout">DECO</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isPPDialogOpen" max-width="600">
      <v-card>
        <v-card-text>
          <v-file-input v-model="PP">
          </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="uploadPP()">update</v-btn>
        </v-card-actions>
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
      isPPDialogOpen: false,
      hasNotBeenApproved:false,
      PP: undefined,
      snackbarMessage: "",
      snackbarMessages: {
        friendRequest: {
          sent: "votre demande d'ami a ete envoye",
          accepted: "T'as un nouveau ami",
          refused: "je suis d'accord c'est un batard",
          lonely: "t'es seul a ce point là 🥺 ?",
          alreadyFriend: "t'es deja ami avec "
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
    console.log(this.user)

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

    deleteNotification(index){
      let {keycloakID , notifications} = this.user
      notifications.splice(index, index + 1);
      this.$axios.put(`/user/${keycloakID}`, {notifications});
    },

    hasRole(team){
      return hasRole(this, team)
    },

    async uploadPP(){
      let form = new FormData();
      form.append('files', this.PP, this.PP.name);
      form.append('_id', getUser(this)._id)
      console.log(this.PP)
      await this.$axios.post('/user/pp', form)
    },

    async clicker(){
      if(this.user.clicks === undefined){
        this.user.clicks = 0;
      }
      this.user.clicks += 1;
      this.$set(this.user, 'clicks', this.user.clicks) // force update
      await this.$axios.put(`/user/${this.user.keycloakID}`, {
        clicks: this.user.clicks,
      })
    },

    async sendFriendRequest() {
      const user = getUser(this)
      let [firstname, lastname] = this.newFriend.split('.');
      if(firstname === user.firstname && lastname === user.lastname){ // asked himself to be friend
        this.snackbarMessage = this.snackbarMessages.friendRequest.lonely;
        this.isSnackbarOpen = true;
        window.open('https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690')
        return
      }
      if(this.user.friends.find(friend => friend.username === this.newFriend)){ // already friends
        this.snackbarMessage = this.snackbarMessages.friendRequest.alreadyFriend + this.newFriend;
        this.isSnackbarOpen = true;
        return
      }
      await this.$axios.put(`/user/notification/${lastname}/${firstname}`, {
        type: 'friendRequest',
        message: `${getUser(this).lastname} ${getUser(this).firstname} vous a envoye une demande d'ami ❤️`,
        from: `${getUser(this).nickname ? getUser(this).nickname : getUser(this).lastname}`,
        date: new Date(),
        data: { username : `${getUser(this).firstname}.${getUser(this).lastname}`, id: getUser(this)._id }
      })
      this.snackbarMessage = this.snackbarMessages.friendRequest.sent;
      this.isSnackbarOpen = true;
    },

    async acceptFriendRequest(notification) {
      if(notification.data) {
        let user = getUser(this);
        user.notifications.pop();
        await this.$axios.post(`/user/friends`,{
          from: user._id,
          to: notification.data
        });
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
    },

    getPPUrl(){
      return process.env.NODE_ENV === 'development' ? 'http://localhost:2424/' : ''
    },

    async logout(){
      await this.$auth.logout();
      await this.$router.push({
        path: '/login',
      })
    },
  },

};
</script>
<style>

</style>
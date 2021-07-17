<template>
  <v-row justify="center" align="center">
    <v-col cols="6" sm="6" md="4">
      <v-card v-if="user">
        <v-card-title>Bonsoir {{user.nickname ? user.nickname : user.firstname}}</v-card-title>
        <v-card-subtitle> {{user.email}}</v-card-subtitle>
        <v-card-text>
          <p>Charisme: {{user.charisma}}</p>
          <v-chip-group>
            <v-chip v-for="team in user.team">
              {{team}}
            </v-chip>
          </v-chip-group>
          <v-progress-linear value="15"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6" sm="4" md="4">
      <v-card v-if="user">
        <v-card-title>Compte perso 💰</v-card-title>
        <v-card-subtitle>Balance: {{user.balance || 0}} €</v-card-subtitle>
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
          <p>{{user.friends}}</p>
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

    <v-col cols="6" sm="4" md="4">
      <v-card v-if="user">
        <v-card-title>Notification 📣️</v-card-title>
        <v-card-text v-if="user.notifications">
          <p>{{user.friends}}</p>
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
  components: {},

  data(){
    return {
      user: undefined,
      newFriend: undefined,
    }
  },

  async mounted() {
    const keycloakID = this.getUsername();
    this.user = await this.getUser(keycloakID);
  },

  methods: {
    getUsername(){
      const token = this.$auth.$storage._state["_token.keycloak"].split(' ')[1]
      const decoded = jwt_decode(token)
      return decoded.sub
    },

    async getUser(keycloakID){
      return this.$axios.$get(`/user/${keycloakID}`)
    },

    async sendFriendRequest(){
      await this.$axios.post('/user/')
    }
  },
};
</script>
<style>

</style>
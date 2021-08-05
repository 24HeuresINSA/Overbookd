<template>
<div>
  <template>
    <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="30"
        class="elevation-1"
    >
      <template v-slot:item.action="{ item }">
        <v-btn fab style="color: blue;" class="fab" :href="('https://www.facebook.com/search/top?q=' + item.firstname + ' ' + item.lastname)">F</v-btn>
        <v-btn fab @click="openTransactionDialog(item)" class="fab" v-if="hasRole('admin')"><v-icon>mdi-cash</v-icon></v-btn>
        <v-btn fab @click="openInformationDialog(item)" class="fab" v-if="hasRole('hard')"><v-icon>mdi-information-outline</v-icon></v-btn>
      </template>

      <template v-slot:item.team="{ item }">
        <v-chip-group>
          <v-chip v-for="team in item.team">
            {{team}}
          </v-chip>
        </v-chip-group>
      </template>
    </v-data-table>
  </template>

  <v-dialog v-model="isTransactionDialogOpen" max-width="600">
    <v-card>
      <v-card-title>Ajouter de 💰</v-card-title>
      <v-card-text>
        <v-text-field label="reason" v-model="newTransaction.reason"></v-text-field>
        <v-text-field label="montant (en euro)" type="number" v-model="newTransaction.amount"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="transaction()">+</v-btn>
        <v-btn @click="transaction(true)">-</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isInformationDialogOpen" max-width="600">
    <v-card>
      <v-card-title>Info sur l'utilisateur</v-card-title>
<!--      <v-card-subtitle>{{this.selectedUser.nickname ? this.selectedUser.nickname : this.selectedUser.lastname}}</v-card-subtitle>-->
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                champ
              </th>
              <th class="text-left">
                valeur
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in desserts"
                :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isUserDialogOpen" max-width="600">
    <v-card>
      <v-card-title>{{selectedUser.nickname ? selectedUser.nickname : selectedUser.lastname}}</v-card-title>
      <v-card-subtitle>
        <v-chip-group>
          <v-chip v-for="team of selectedUser.team">{{team}}</v-chip>
        </v-chip-group>
      </v-card-subtitle>
      <v-card-text>
        <v-text-field
          label="ajouter un role"
        ></v-text-field>
        <v-btn>ajouter</v-btn>

        <v-simple-table>
          <tbody>
          <tr>
            <td>Nom</td>
            <td>{{selectedUser.lastname}} {{selectedUser.firstname}}</td>
          </tr>

          <tr>
            <td>Date de naissance</td>
            <td>{{selectedUser.birthday}}</td>
          </tr>

          <tr>
            <td>tel</td>
            <td>{{selectedUser.phone}}</td>
          </tr>

          <tr>
            <td>email</td>
            <td>{{selectedUser.email}}</td>
          </tr>

          <tr>
            <td>compte perso</td>
            <td>{{selectedUser.balance}}</td>
          </tr>

          <tr>
            <td>amis</td>
            <td>{{selectedUser.friends}}</td>
          </tr>

          <tr>
            <td>ID</td>
            <td>{{selectedUser.keycloakID}}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar
      v-model="isSnackbarOpen"
      :timeout="timeout"
  >
    💸 transaction done 🥳

    <template v-slot:action="{ attrs }">
      <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</div>
</template>

<script>
export default {
  name: "humans",

  data(){
    return {
      users: [],
      headers: [
        { text: 'prenom', value: 'firstname' },
        { text: 'nom', value: 'lastname' },
        { text: 'surnom', value: 'nickname' },
        { text: 'team', value: 'team' },
        { text: 'charsime', value: 'charisma' },
        { text: 'action', value: 'action' },
      ],

      isTransactionDialogOpen: false,
      isInformationDialogOpen: false,
      isUserDialogOpen: false,
      isSnackbarOpen: false,
      selectedUser: {
        nickname: undefined,
      },
      newTransaction: {
        reason: 'recharge compte perso',
        amount: undefined,
      }
    }
  },

  async mounted() {
    if (!this.hasRole('hard')){
      await this.$router.push({
        path: '/index'
      })
    } else {
      // user has the HARD role
      this.users = (await this.$axios.get('/user')).data;
    }
  },

  methods: {
    getUser(){
      return this.$store.state.user.data
    },

    hasRole(role){
      const teams = this.getUser()?.team;
      if (teams === undefined){
        return false
      }
      if (typeof role === 'object'){
        // list of roles
        let res = false;
        role.forEach(r => {
          if(teams.includes(r)){
            res = true
          }
        })
        return res
      } else {
        return teams.includes(role);
      }
    },

    openTransactionDialog(user){
      this.isTransactionDialogOpen = true;
      this.selectedUser = user;
    },

    openInformationDialog(user){
      this.selectedUser = user;
      this.isUserDialogOpen = true;
    },

    async transaction(isNegative){
      if(!this.selectedUser.transactionHistory){
        this.selectedUser.transactionHistory = []
      }
      if(this.selectedUser.transactionHistory.length >= 3){
        this.selectedUser.transactionHistory.shift()
      }
      this.selectedUser.transactionHistory.push(this.newTransaction);

      if(isNegative){
        this.selectedUser.balance = +this.selectedUser.balance - +this.newTransaction.amount
      } else{
        this.selectedUser.balance += +this.selectedUser.balance + +this.newTransaction.amount
      }
      await this.$axios.put('/user/' + this.selectedUser.keycloakID, this.selectedUser);
      this.isSnackbarOpen = true;
    }
  }
}
</script>

<style scoped>
.fab{
  margin: 5px;
}
</style>
<template>
<div>
  <template style="display: grid">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Filtres</v-card-title>
          <v-card-text>
            <v-text-field label="Recherche" v-model="filters.search"></v-text-field>
            <v-switch label="Permis" v-model="filters.driverLicence" ></v-switch>
            <v-container class="py-0">
              <v-row
                  align="center"
                  justify="start"
              >
                <v-combobox
                    chips
                    multiple
                    clearable
                    label="team"
                    :items="getConfig('teams').map(e => e.name)"
                    v-model="filters.teams"
                >
                  <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip
                        v-bind="attrs"
                        :input-value="selected"
                        close
                        :color="getRoleMetadata(item).color"
                    >
                      <v-icon left color="white">
                        {{getRoleMetadata(item).icon}}
                      </v-icon>
                      <a style="color: white">{{getRoleMetadata(item).name}}</a>
                    </v-chip>
                  </template>

                </v-combobox>

              </v-row>
            </v-container>
          </v-card-text>
        </v-card>

      </v-col>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="filteredUsers"
            :items-per-page="30"
            class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <v-btn fab style="color: blue;" class="fab" :href="('https://www.facebook.com/search/top?q=' + item.firstname + ' ' + item.lastname)">F</v-btn>
            <v-btn fab @click="openTransactionDialog(item)" class="fab" v-if="hasRole('admin')"><v-icon>mdi-cash</v-icon></v-btn>
            <v-btn fab @click="openInformationDialog(item)" class="fab" v-if="hasRole('hard')"><v-icon>mdi-information-outline</v-icon></v-btn>
          </template>

          <template v-slot:item.team="{ item }">
            <over-chips :roles="item.team"></over-chips>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <div>
    </div>

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
        <over-chips :roles="selectedUser.team"></over-chips>
      </v-card-subtitle>
      <v-card-text>
        <div v-if="hasRole(['admin', 'bureau'])">
          <v-select
            label="ajouter un role"
            :items="getConfig('teams').map(e => e.name)"
            v-model="newRole"
          ></v-select>
          <v-btn @click="addRole()">ajouter</v-btn>
        </div>

        <v-img v-if="selectedUser.pp" :src=" ( getPPUrl() ) +  'api/user/pp/' + selectedUser.pp"></v-img>

        <v-simple-table>
          <tbody>
          <tr>
            <td>Nom</td>
            <td>{{selectedUser.lastname}} {{selectedUser.firstname}}</td>
          </tr>

          <tr>
            <td>Date de naissance</td>
            <td>{{selectedUser.birthdate}}</td>
          </tr>

          <tr>
            <td>tel</td>
            <td>{{selectedUser.phone}}</td>
          </tr>

          <tr>
            <td>Charisme</td>
            <td>{{selectedUser.charisma}}</td>
          </tr>

          <tr>
            <td>Nombre de dispo </td>
            <td>{{selectedUser.availabilities ? selectedUser.availabilities.length : 0}}</td>
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
            <td>{{selectedUser.friends ? selectedUser.friends.map(f => f.username).join(', ') : ''}}</td>
          </tr>

          <tr>
            <td>keycloakID</td>
            <td>{{selectedUser.keycloakID}}</td>
          </tr>

          <tr>
            <td>ID</td>
            <td>{{selectedUser._id}}</td>
          </tr>

          <tr>
            <td>Handicap</td>
            <td>{{selectedUser.handicap}}</td>
          </tr>

          <tr>
            <td>📚</td>
            <td>{{selectedUser.year}}  {{selectedUser.departement}}</td>
          </tr>

          <tr>
            <td>Commentaire</td>
            <td>{{selectedUser.comment}}</td>
          </tr>

          <tr v-if="hasRole('admin')">
            <td># secu social</td>
            <td>{{selectedUser.socialSecurity}}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar
      v-model="isSnackbarOpen"
      :timeout="5000"
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
import {getConfig, getUser, hasRole} from "../common/role";
import OverChips from "../components/overChips";

export default {
  name: "humans",
  components: {OverChips},
  data(){
    return {
      users: [],
      filteredUsers: [],
      headers: [
        { text: 'prenom', value: 'firstname' },
        { text: 'nom', value: 'lastname' },
        { text: 'surnom', value: 'nickname' },
        { text: 'team', value: 'team' },
        { text: 'charsime', value: 'charisma' },
        { text: 'action', value: 'action' },
      ],

      teams: getConfig(this, 'teams'),
      loading: false,

      filters: {
        search: undefined,
        driverLicence: undefined,
        teams: [],
      },

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
      },
      newRole: undefined,
    }
  },

  async mounted() {
    if (!this.hasRole('hard')){
      await this.$router.push({
        path: '/index'
      })
    } else {
      // user has the HARD role
      this.users = (await this.$axios.get('/user')).data
      this.filteredUsers = this.users;
    }
  },

  methods: {
    async addRole(){
      let user = this.selectedUser;
      if(user.team === undefined){
        user.team = [];
      }
      if(user.team.find(role => role === this.newRole)){
        // already has role
      } else {
        user.team.push(this.newRole);
        this.$set(user, 'team', user.team) // update rendering
        await this.$axios.put(`/user/${user.keycloakID}`, {team: user.team});
      }
    },

    getPPUrl(){
      return process.env.NODE_ENV === 'development' ? 'http://localhost:2424/' : ''
    },

    getConfig(key){
      return getConfig(this,key)
    },

    getUser(){
      return getUser(this)
    },

    hasRole(role){
      return hasRole(this, role)
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

      if(this.selectedUser.balance === undefined){
        this.selectedUser.balance = 0;
      }

      if(isNegative){
        this.selectedUser.balance = +this.selectedUser.balance - +this.newTransaction.amount
      } else{
        this.selectedUser.balance += +this.selectedUser.balance + +this.newTransaction.amount
      }
      await this.$axios.put('/user/' + this.selectedUser.keycloakID, this.selectedUser);
      this.isSnackbarOpen = true;
      this.isTransactionDialogOpen = false;
    },

    getRoleMetadata(roleName){
      return this.teams.find(e => e.name === roleName);
    },
  },

  watch:{
    filters: {
      handler(){
        const mUsers = this.users;

        // filter by team
        if(this.filters.teams){
          this.filteredUsers  = mUsers.filter(user => {
            if(user.team){
              return user.team.filter(value => this.filters.teams.includes(value)).length === this.filters.teams.length;
            } else {
              return false
            }
          })
        }
      },
      deep: true
    },

    selections () {
      const selections = []

      for (const selection of this.filters.teams) {
        selections.push(selection)
      }

      return selections
    },
  }
}
</script>

<style scoped>
.fab{
  margin: 5px;
}
</style>
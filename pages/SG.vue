<template>
  <!-- TODO ::  HAVE FUN -->
  <v-container>
    <h1>SG 🥵</h1>
    <v-container style="display: flex; width: 100%; position: absolute">
      <v-card>
        <v-card-text style="display: flex; flex-direction: column">
          <v-text-field label="Recherche"></v-text-field>
          <v-text-field
            v-model="totalPrice"
            label="Prix total"
            type="number"
          ></v-text-field>
          <label>Nombre de bâton total: {{ totalConsumptions }}</label>
          <label>Mode</label>
          <template>
            <v-btn-toggle
              v-model="isExpenseMode"
              tile
              color="deep-purple accent-3"
              group
            >
              <v-btn :value="true" small> Dépense</v-btn>

              <v-btn :value="false" small> Dépot</v-btn>
            </v-btn-toggle>
          </template>
          <v-btn text>Enregistrer</v-btn>
          <v-btn text>Envoyer un mail au négatif</v-btn>
        </v-card-text>
      </v-card>

      <v-data-table :headers="headers" :items="filteredUsers">
        <template #[`item.action`]="{ item }" style="display: flex">
          <v-text-field
            v-model="item.newConsumption"
            type="number"
            label="Nombre de bâton"
          ></v-text-field>
        </template>

        <template #[`item.balance`]="{ item }">
          {{ (item.balance || 0).toFixed(2) }} €
        </template>

        <template #[`item.newConsumption`]="{ item }">
          {{
            (
              (+totalPrice / +totalConsumptions) * item.newConsumption || 0
            ).toFixed(2)
          }}
          €
        </template>
      </v-data-table>
    </v-container>
  </v-container>
</template>

<script>
import OverChips from "../components/overChips";

/**
 * the goal of this page is to make it easier for SG to enter new consumption and count them
 * after changing a barrel the SG goes to this page and enter the coast of that barrel (totalConsumption)
 * then enter how much each user has a stick next to his name in the paper. after that the SG press a save button
 * and every user that consumed get charged accordingly
 */
export default {
  name: "SG",

  data: () => {
    return {
      users: [],
      filteredUsers: [],
      totalConsumption: undefined, // total coast of the barrel
      totalPrice: 0,

      isExpenseMode: false,

      headers: [
        { text: "prénom", value: "firstname" },
        { text: "nom", value: "lastname" },
        { text: "surnom", value: "nickname" },
        { text: "CP", value: "balance" },
        { text: "Nouvelle conso", value: "newConsumption" },
        { text: "action", value: "action" },
      ],
    };
  },

  computed: {
    totalConsumptions() {
      let totalConsumptions = 0;
      this.filteredUsers.forEach((user) => {
        if (user.newConsumption) {
          totalConsumptions += +user.newConsumption;
        }
      });
      return totalConsumptions;
    },
  },

  async mounted() {
    this.users = await this.getAllUsers();
    this.filteredUsers = this.users;
  },

  methods: {
    async getAllUsers() {
      return (await this.$axios.get("/user")).data;
    },

    async updateUser(keycloakID, data) {
      return this.$axios.put("/user/" + keycloakID, data);
    },

    addTransactionHistory(user, amount) {
      // amount un float
      if (!user.transactionHistory) {
        user.transactionHistory = []; // init notification if doesn't exist
      }
      user.transactionHistory.unshift({
        reason: "consomation au local",
        amount: "-" + amount,
      });
    },

    updateUserBalance(user, amount) {
      if (!user.balance) {
        user.balance = 0; // init notification if doesn't exist
      }
      user.balance = user.balance - +amount; // safe code
    },
    /**
     *
     * @param user user object
     * @param amount float
     */
    addConsumption(user, amount) {
      this.updateUserBalance(user, amount);
      this.addTransactionHistory(user, amount);
      // update user in database
      this.updateUser(user.keycloakID, {
        transactionHistory: user.transactionHistory,
        balance: user.balance,
      });
    },
  },
};
</script>

<style scoped></style>

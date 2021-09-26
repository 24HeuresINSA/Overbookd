<template>
  <!-- TODO ::  HAVE FUN -->
  <v-container>
    <h1>SG 🥵</h1>
  </v-container>
</template>

<script>
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
      users: [], // TODO :: load users here
      totalConsumption: undefined, // total coast of the barrel
    };
  },

  mounted() {},

  methods: {
    async getAllUsers() {
      return this.$axios.get("/user");
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
        reason: "consommation au local",
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

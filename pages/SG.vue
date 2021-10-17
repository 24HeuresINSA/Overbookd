<template>
  <v-container>
    <h1>SG 🥵</h1>
    <v-container style="display: flex; width: 100%">
      <v-card>
        <v-card-text style="display: flex; flex-direction: column">
          <v-text-field
            v-if="isExpenseMode"
            v-model="totalPrice"
            label="Prix total"
            type="number"
          ></v-text-field>
          <label
            >{{
              isExpenseMode ? "Nombre de bâton total" : "Nombre total d'argent"
            }}: {{ totalConsumptions }}</label
          >
          <label v-if="isExpenseMode"
            >Prix du bâton:
            {{ stickPrice }}
            €</label
          >
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
          <v-btn text @click="saveTransactions">Enregistrer</v-btn>
          <v-btn text>Envoyer un mail au négatif</v-btn>
          <br />
          <h3>Solde de la caisse {{ totalCPBalance.toFixed(2) }} €</h3>
        </v-card-text>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="users"
        style="width: 100%"
        disable-pagination
        hide-default-footer
        dense
      >
        <template #[`item.action`]="{ item }" style="display: flex">
          <v-text-field
            v-model="item.newConsumption"
            type="number"
            :label="isExpenseMode ? 'Nombre de bâton' : 'thunas (en euro)'"
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
    <v-dialog v-model="isSwitchDialogOpen" width="600px">
      <v-card>
        <v-card-title>Attention</v-card-title>
        <v-card-text
          >Si tu change de mode les donnees non enregister seront effeace
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cleanInputs">changer de mode</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackNotificationContainer />
  </v-container>
</template>

<script>
/**
 * the goal of this page is to make it easier for SG to enter new consumption and count them
 * after changing a barrel the SG goes to this page and enter the coast of that barrel (totalConsumption)
 * then enter how much each user has a stick next to his name in the paper. after that the SG press a save button
 * and every user that consumed get charged accordingly
 */
import transactionRepo from "../repositories/transactionRepo";
import SnackNotificationContainer from "../components/molecules/snackNotificationContainer";
import { RepoFactory } from "~/repositories/repoFactory";

const { safeCall } = require("../utils/api/calls");

export default {
  name: "SG",
  components: { SnackNotificationContainer },

  data: () => {
    return {
      users: [],
      totalConsumption: undefined, // total coast of the barrel
      totalPrice: 0,
      totalCPBalance: 0,

      isExpenseMode: true,
      isSwitchDialogOpen: false,

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
      this.users.forEach((user) => {
        if (user.newConsumption) {
          totalConsumptions += +user.newConsumption;
        }
      });
      return totalConsumptions;
    },
    stickPrice() {
      return (+this.totalPrice / +this.totalConsumptions).toFixed(2);
    },
  },

  watch: {
    isExpenseMode() {
      this.isSwitchDialogOpen = true;
    },
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsers(this)
    );
    if (res) {
      this.users = res.data;
    }
    this.users.forEach((user) => {
      if (user.balance) {
        this.totalCPBalance += +user.balance;
      }
    });
  },

  methods: {
    async saveTransactions() {
      let usersWithConsumptions = this.users.filter((u) => u.newConsumption);

      let isCorrect = true;

      // verify new consumptions are positive digits
      usersWithConsumptions.forEach((user) => {
        if (this.isExpenseMode) {
          // mode depense (Baton)
          try {
            if (
              user.newConsumption.includes(",") ||
              user.newConsumption.includes(".")
            ) {
              isCorrect = false;
            }
            if (+user.newConsumption < 0) {
              isCorrect = false;
            }
          } catch {
            isCorrect = false;
          }

          // verify totalPrice
          try {
            this.totalPrice = +this.totalPrice;
          } catch {
            isCorrect = false;
          }

          if (this.totalPrice === 0) {
            isCorrect = false;
          }
        } else {
          // is depot mode
        }
      });

      if (!isCorrect) {
        await this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "Il faut mettre des nombre",
        });
        return;
      }

      let transactions = usersWithConsumptions.map((user) => {
        if (this.isExpenseMode) {
          const amount = +(
            (+this.totalPrice / +this.totalConsumptions) *
            user.newConsumption
          );
          return {
            type: "expense",
            from: user.keycloakID,
            to: null,
            createdAt: new Date(),
            amount: this.round(amount),
            context: `Conso au local de ${user.newConsumption} bâton à ${(+this
              .stickPrice).toFixed(2)} €`,
          };
        } else {
          user.newConsumption = user.newConsumption.replace(",", ".");
          return {
            type: "deposit",
            from: null,
            to: user.keycloakID,
            createdAt: new Date(),
            amount: (+user.newConsumption).toFixed(2),
            context: `Recharge de compte perso le ${new Date().toDateString()}`,
          };
        }
      });
      await transactionRepo.createTransactions(this, transactions);
      await this.$store.dispatch("notif/pushNotification", {
        type: "success",
        message: "Operations confirmées 💰💰💰",
      });

      usersWithConsumptions.forEach((u) => (u.newConsumption = ""));
    },

    cleanInputs() {
      let usersWithConsumptions = this.users.filter((u) => u.newConsumption);
      usersWithConsumptions.forEach((u) => (u.newConsumption = ""));
      this.isSwitchDialogOpen = false;
    },

    round(rawAmount) {
      return (Math.round(+rawAmount * 100) / 100).toFixed(2);
    },
  },
};
</script>

<style scoped></style>

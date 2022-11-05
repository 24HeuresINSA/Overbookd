<template>
  <v-container>
    <h1>SG 🥵</h1>
    <v-container style="display: flex; width: 100%">
      <v-card>
        <v-card-text style="display: flex; flex-direction: column">
          <label>Mode</label>
          <v-container>
            <v-btn-toggle
              v-model="mode"
              tile
              color="deep-purple accent-3"
              group
            >
              <v-btn value="cask" small> Fût</v-btn>
              <v-btn value="closet" small> Placard</v-btn>
              <v-btn value="deposit" small> Dépot</v-btn>
            </v-btn-toggle>
          </v-container>
          <v-list v-if="!areInputsValid.res">
            <v-list-item
              v-for="(reason, key) in areInputsValid.reason"
              :key="key"
            >
              <v-list-item-content style="color: red">{{
                reason
              }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <template v-if="isCask">
            <v-text-field
              v-model="totalPrice"
              label="Prix total"
              type="number"
              :rules="[
                (v) =>
                  new RegExp(regex.float).test(v) ||
                  `il faut mettre un nombre (avec . comme virgule)`,
              ]"
            ></v-text-field>
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
            <label
              >Prix du bâton:
              {{ stickPrice }}
              €</label
            >
          </template>

          <template v-if="mode === 'closet'">
            <v-text-field
              v-model="settledStickPrice"
              label="Prix du bâton"
              type="number"
              :rules="[
                (v) =>
                  new RegExp(regex.float).test(v) ||
                  `Il faut mettre un nombre (avec . comme virgule)`,
              ]"
            ></v-text-field>
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
          </template>

          <template v-if="mode === 'deposit'">
            <label> Depot total: {{ totalConsumptions }} €</label>
          </template>
          <v-btn
            v-if="hasRole('sg')"
            :disabled="!areInputsValid.res"
            @click="saveTransactions"
            >Enregistrer</v-btn
          >
          <!--<v-btn text>Envoyer un mail au négatif</v-btn>-->
          <br />
          <br />
          <h3>Solde de la caisse {{ totalCPBalance.toFixed(2) }} €</h3>

          <v-radio-group
            v-if="ready && isCask"
            v-model="totalPrice"
            column
            style="display: flex; flex-direction: column"
          >
            <v-radio label="Fut blonde" :value="sgConfig.prixFutBlonde">
            </v-radio>
            <v-radio label="Fut Blanche" :value="sgConfig.prixFutBlanche">
            </v-radio>
            <v-radio label="Fut Triple" :value="sgConfig.prixFutTriple">
            </v-radio>
            <v-radio label="Fut Flower Wager" :value="sgConfig.prixFutFlower">
            </v-radio>
          </v-radio-group>
          <v-btn v-if="isCask" @click="openSgConfigForm">
            Configuration des fûts
          </v-btn>
        </v-card-text>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="users"
        style="width: 100%"
        disable-pagination
        hide-default-footer
        dense
        multi-sort
        :sort-by="['firstname', 'lastname']"
      >
        <template #[`item.action`]="{ item }" style="display: flex">
          <v-text-field
            v-model="item.newConsumption"
            :label="isExpenseMode ? 'Nombre de bâton' : 'thunas (en euro)'"
            :rules="rules"
          ></v-text-field>
        </template>

        <template #[`item.balance`]="{ item }">
          {{ (item.balance || 0).toFixed(2) }} €
        </template>

        <template #[`item.newConsumption`]="{ item }">
          <div v-if="isExpenseMode">
            {{
              (
                (isCask ? stickPrice : settledStickPrice) *
                  item.newConsumption || 0
              ).toFixed(2)
            }}
            €
          </div>
          <div v-else>{{ (+item.newConsumption || 0).toFixed(2) }}€</div>
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="isSwitchDialogOpen" width="600px">
      <v-card>
        <v-card-title>Attention</v-card-title>
        <v-card-text
          >Si tu changes de mode, les données non enregistrées seront effacées.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cleanInputs">Changer de mode</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isSgConfigDialogOpen" width="600px">
      <SgConfigForm />
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
import SgConfigForm from "@/components/organisms/SgConfigForm";
const { safeCall } = require("../utils/api/calls");

export default {
  name: "SG",
  components: { SnackNotificationContainer, SgConfigForm },

  data: () => {
    return {
      ready: false,
      users: [],
      totalConsumption: undefined, // total coast of the barrel
      totalPrice: undefined,
      totalCPBalance: 0,
      settledStickPrice: 0.5,

      mode: "cask", //default mode
      isSwitchDialogOpen: false,
      isSgConfigDialogOpen: false,
      regex: {
        int: "^\\d*$",
        float: "^\\d*(\\.\\d+)?$",
      },

      feedbacks: {
        totalPrice: "Prix total n'est pas un nombre",
        settledStickPrice: "Prix du baton n'est pas un nombre",
        noNewConsumption: "pas de nouvelle consomation ou de dépot",
        wrongNewConsumption: `champs non valide pour l'utilisateur: `,
      },
      reasons: [],

      headers: [
        { text: "Prénom", value: "firstname" },
        { text: "Nom", value: "lastname" },
        { text: "Surnom", value: "nickname" },
        { text: "CP", value: "balance" },
        { text: "Nouvelle conso", value: "newConsumption" },
        { text: "Action", value: "action" },
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
      const unitPrice = +(+this.totalPrice / +this.totalConsumptions); //Prix total / nombre de bâton -> prix d'un bâton
      const round = Math.round(unitPrice * 100); //arrondi au centime
      return ((round + 5) * 0.01).toFixed(2); // rajout d'une marge de sécurité de 5 centimes
    },
    rules() {
      const regex = this.isExpenseMode ? this.regex.int : this.regex.float;
      return [
        (v) => new RegExp(regex).test(v) || `Il faut mettre un nombre valide`,
      ];
    },
    isExpenseMode() {
      return this.mode === "cask" || this.mode === "closet";
    },
    isCask() {
      return this.mode === "cask";
    },
    areInputsValid() {
      let res = true;
      let reason = [];

      let mUsers = this.users.filter((u) => u.newConsumption);

      if (mUsers === []) {
        res = false;
        reason.push(this.feedbacks.noNewConsumption);
      }

      switch (this.mode) {
        case "cask":
          if (!this.isFloat(this.totalPrice)) {
            res = false;
            reason.push(this.feedbacks.totalPrice);
          }
          mUsers.forEach((user) => {
            if (!this.isInteger(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;

        case "closet":
          if (!this.isFloat(this.settledStickPrice)) {
            res = false;
            reason.push(this.feedbacks.settledStickPrice);
          }
          mUsers.forEach((user) => {
            if (!this.isInteger(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;

        case "deposit":
          mUsers.forEach((user) => {
            if (!this.isFloat(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;
      }
      return {
        res,
        reason,
      };
    },
    sgConfig() {
      return this.$accessor.configuration.get("sg");
    },
  },

  watch: {
    mode() {
      this.isSwitchDialogOpen = true;
    },
  },

  async mounted() {
    if (this.$accessor.user.hasRole("sg")) {
      await this.$accessor.configuration.fetch("sg");
      this.ready = true;
      await safeCall(this.$store, RepoFactory.userRepo.getAllUsers(this)).then(
        (res) => {
          this.users = res.data.filter((user) => this.isUserWithCP(user));
        }
      );
      this.users.forEach((user) => {
        if (user.balance) {
          this.totalCPBalance += +user.balance;
        }
      });
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },
    isUserWithCP(user) {
      return (
        user.team.includes("hard") &&
        !(
          user.team.includes("fen") ||
          user.team.includes("voiture") ||
          user.team.includes("camion")
        )
      );
    },
    isFloat(number) {
      const floatRegex = new RegExp(this.regex.float);
      return floatRegex.test(number);
    },
    isInteger(number) {
      const floatRegex = new RegExp(this.regex.int);
      return floatRegex.test(number);
    },
    async saveTransactions() {
      let usersWithConsumptions = this.users.filter((u) => u.newConsumption);

      let isCorrect = true;

      // verify new consumptions are positive digits
      usersWithConsumptions.forEach((user) => {
        if (isNaN(user.newConsumption)) {
          isCorrect = false;
        }

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
        }
      });

      if (!isCorrect) {
        await this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "Il faut mettre des nombres",
        });
        return;
      }

      let transactions = usersWithConsumptions.map((user) => {
        let transaction = {
          type: "EXPENSE",
          from: -1,
          to: -1,
        };
        switch (this.mode) {
          case "cask":
            transaction.from = user.id;
            transaction.to = user.id;
            //cast to float
            transaction.amount = +(
              +this.stickPrice * +user.newConsumption
            ).toFixed(2);
            transaction.context = `Conso au local de ${user.newConsumption} bâton à ${this.stickPrice} €`;
            this.totalCPBalance -= transaction.amount;
            user.balance -= transaction.amount;
            break;

          case "closet":
            transaction.from = user.id;
            transaction.to = user.id;
            transaction.amount = +(
              +this.settledStickPrice * +user.newConsumption
            ).toFixed(2);
            transaction.context = `Conso placard:  ${user.newConsumption} bâtons`;
            this.totalCPBalance -= transaction.amount;
            user.balance -= transaction.amount;
            break;

          case "deposit":
            transaction.type = "DEPOSIT";
            transaction.to = user.id;
            transaction.from = user.id;
            transaction.amount = +user.newConsumption;
            transaction.context = `Recharge de compte perso`;
            this.totalCPBalance += transaction.amount;
            user.balance += transaction.amount;
            break;
        }

        return transaction;
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
    openSgConfigForm() {
      this.isSgConfigDialogOpen = true;
    },
  },
};
</script>

<style scoped></style>

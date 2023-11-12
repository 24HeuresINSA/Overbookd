<template>
  <v-container>
    <h1>SG 🥵</h1>
    <v-container style="display: flex; width: 100%">
      <v-card>
        <v-card-title>Mode</v-card-title>
        <v-card-text style="display: flex; flex-direction: column">
          <div>
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
          </div>
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
            <MoneyField v-model="totalPrice" label="Prix du fût" />
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
            <MoneyField :value="stickPrice" readonly label="Prix du bâton" />
          </template>

          <template v-if="mode === 'closet'">
            <MoneyField v-model="settledStickPrice" label="Prix du bâton" />
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
          </template>

          <template v-if="mode === 'deposit'">
            <MoneyField
              :value="totalConsumptions"
              readonly
              label="Depot total"
            />
          </template>
          <v-btn :disabled="!areInputsValid.res" @click="saveTransactions"
            >Enregistrer</v-btn
          >
          <br />
          <br />
          <h3>
            <MoneyField
              :value="totalCPBalance"
              readonly
              label="Solde de la caisse"
            />
          </h3>

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
          <v-btn class="mt-4" :href="negativeBalanceMailLink">
            Envoyer un mail aux CP négatifs
          </v-btn>
        </v-card-text>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="consumers"
        style="width: 100%"
        disable-pagination
        hide-default-footer
        dense
        multi-sort
        :sort-by="['firstname', 'lastname']"
      >
        <template #item.action="{ item }">
          <v-text-field
            v-if="isExpenseMode"
            v-model="item.newConsumption"
            label="Nombre de bâtons"
            :rules="rules"
            type="number"
          ></v-text-field>
          <MoneyField
            v-else
            v-model="item.newConsumption"
            label="thunas (en euro)"
          />
        </template>

        <template #item.balance="{ item }">
          <MoneyField :value="item.balance" readonly />
        </template>

        <template #item.newConsumption="{ item }">
          <MoneyField :value="spend(item.newConsumption)" readonly />
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="isSwitchDialogOpen" width="600px">
      <v-card>
        <v-card-title>Attention</v-card-title>
        <v-card-text>
          Si tu changes de mode, les données non enregistrées seront effacées.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cleanInputs">Changer de mode</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isSgConfigDialogOpen" width="600px">
      <SgConfigForm @close-dialog="closeConfigDialog" />
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
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import SgConfigForm from "~/components/organisms/personal-account/SgConfigForm.vue";
import { computeUnitPrice } from "~/domain/volunteer-consumption/drink-consumption";
import { RepoFactory } from "~/repositories/repo-factory";
import { NEGATIVE_CP_BODY_TEMPLATE } from "~/utils/mail/mail-body.constant";
import { mailLinkForClient } from "~/utils/mail/mail.utils";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";
import { Money } from "~/utils/money/money";

const TRANSACTION_DEPOSIT = "DEPOSIT";
const TRANSACTION_BARREL = "BARREL";
const TRANSACTION_PROVISIONS = "PROVISIONS";

export default {
  name: "SG",
  components: { SnackNotificationContainer, SgConfigForm, MoneyField },

  data: () => {
    return {
      ready: false,
      users: [],
      totalConsumption: 0,
      totalPrice: 0,
      settledStickPrice: 50,

      mode: "cask", //default mode
      isSwitchDialogOpen: false,
      isSgConfigDialogOpen: false,
      regex: {
        int: new RegExp("^\\d*$"),
        float: new RegExp("^\\d*(\\.\\d+)?$"),
      },

      feedbacks: {
        totalPrice: "Prix total n'est pas un nombre",
        settledStickPrice: "Prix du baton n'est pas un nombre",
        noNewConsumption: "pas de nouvelle consomation ou de dépot",
        wrongNewConsumption: "champs non valide pour l'utilisateur: ",
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

  head: () => ({
    title: "SG",
  }),

  computed: {
    consumers() {
      return this.$accessor.user.personalAccountConsumers.map(
        ({ firstname, lastname, nickname, id, email, balance }) => ({
          firstname,
          lastname,
          nickname,
          id,
          balance,
          email,
          newConsumption: 0,
        }),
      );
    },
    totalCPBalance() {
      return this.users.reduce((sum, user) => sum + user.balance, 0);
    },
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
      return computeUnitPrice(+this.totalPrice, +this.totalConsumptions);
    },
    rules() {
      const regex = this.isExpenseMode ? this.regex.int : this.regex.float;
      return [(v) => regex.test(v) || "Il faut mettre un nombre valide"];
    },
    isExpenseMode() {
      return this.mode === "cask" || this.mode === "closet";
    },
    isCask() {
      return this.mode === "cask";
    },
    transactionType() {
      switch (this.mode) {
        case "cask":
          return TRANSACTION_BARREL;
        case "closet":
          return TRANSACTION_PROVISIONS;
        case "deposit":
        default:
          return TRANSACTION_DEPOSIT;
      }
    },
    areInputsValid() {
      let res = true;
      let reason = [];

      let mUsers = this.users.filter((u) => u.newConsumption);

      if (mUsers.length === 0) {
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
      return this.$accessor.personalAccount.barrels;
    },
    negativeBalanceMailLink() {
      const inDebtConsumers = this.consumers.filter(
        (consumer) => consumer.balance < 0,
      );
      const mails = inDebtConsumers.map((consumer) => consumer.email);

      const mailVars = {
        bcc: mails.join("; "),
        subject: "[24 heures] Ton compte perso est dans le négatif",
        body: NEGATIVE_CP_BODY_TEMPLATE,
      };

      return mailLinkForClient(mailVars);
    },
  },

  watch: {
    mode() {
      this.isSwitchDialogOpen = true;
    },
  },

  async mounted() {
    await this.$accessor.personalAccount.fetchBarrels();
    await this.$accessor.user.fetchPersonalAccountConsumers();
    this.totalPrice = this.sgConfig.prixFutBlonde;
    this.users = this.consumers;
    this.ready = true;
  },

  methods: {
    isFloat(number) {
      return this.regex.float.test(number);
    },
    isInteger(number) {
      return this.regex.int.test(number);
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

      const transactions = usersWithConsumptions.map((user) => {
        const amount = this.spend(user.newConsumption);
        const context = this.defineContext(user.newConsumption);
        const type = this.transactionType;
        const transaction = {
          type,
          from: user.id,
          to: user.id,
          amount,
          context,
        };

        switch (transaction.mode) {
          case TRANSACTION_BARREL:
            user.balance -= amount;
            break;

          case TRANSACTION_DEPOSIT:
            user.balance += amount;
            break;
        }

        return transaction;
      });

      await RepoFactory.TransactionRepository.createTransactions(
        this,
        transactions,
      );

      await Promise.all([
        this.$accessor.user.fetchPersonalAccountConsumers(),
        this.$store.dispatch("notif/pushNotification", {
          type: "success",
          message: "Operations confirmées 💰💰💰",
        }),
      ]);

      this.cleanInputs();
    },
    cleanInputs() {
      this.users = this.consumers;
      this.isSwitchDialogOpen = false;
    },
    openSgConfigForm() {
      this.isSgConfigDialogOpen = true;
    },
    closeConfigDialog() {
      this.isSgConfigDialogOpen = false;
    },
    spend(consumptions) {
      switch (this.mode) {
        case "cask":
          return +this.stickPrice * consumptions || 0;
        case "closet":
          return this.settledStickPrice * consumptions;
        case "deposit":
        default:
          return consumptions;
      }
    },
    defineContext(consumptions) {
      switch (this.mode) {
        case "cask":
          return `Conso au local de ${consumptions} bâton à ${Money.displayCents(
            this.stickPrice,
          )}`;
        case "closet":
          return `Conso placard:  ${consumptions} bâtons`;
        case "deposit":
        default:
          return "Recharge de compte perso";
      }
    },
  },
};
</script>

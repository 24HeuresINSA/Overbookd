<template>
  <v-dialog v-model="toggled" :retain-focus="false" max-width="600">
    <v-card>
      <v-card-title>Effectuer un virement</v-card-title>
      <v-card-text>
        <v-form v-model="transfer.isValid">
          <v-autocomplete
            v-model="transfer.user"
            :items="userList"
            label="Utilisateur"
            required
            dense
          ></v-autocomplete>

          <v-text-field
            v-model="transfer.amount"
            type="number"
            label="Montant"
            required
          ></v-text-field>

          <v-text-field v-model="transfer.reason" label="Raison"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="transferMoney()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Transfer } from "~/utils/models/transaction";
import { CompleteUser, MyUserInformation } from "~/utils/models/user";

type UserAutocompleteItem = {
  text?: string;
  value: Partial<CompleteUser>;
};

export default Vue.extend({
  name: "TransferDialog",

  data: () => {
    return {
      transfer: {
        user: {
          username: undefined,
          id: 0,
        },
        amount: "0",
        reason: "",
        isValid: false,
      },
    };
  },
  computed: {
    type(): string {
      return this.$accessor.dialog.type
    },
    open(): boolean {
      return this.$accessor.dialog.open
    },
    me(): MyUserInformation {
      return this.$accessor.user.me
    },
    toggled: {
      get: function (): boolean | unknown {
        if (this.type == "transfer") {
          return this.open;
        }
        if (!this.open) {
          return false;
        }
        return false;
      },
      set(val): void {
        if (!val) {
          this.$store.dispatch("dialog/closeDialog");
        }
      },
    },
    userList(): UserAutocompleteItem[] {
      return this.$accessor.user.personalAccountConsumers.map(
        ({ firstname, lastname, id }) => {
          const username = `${firstname} ${lastname}`;
          const value: Partial<CompleteUser> = {
            firstname,
            lastname,
            id,
          };
          return {
            text: username,
            value,
          };
        }
      );
    },
  },
  mounted() {
    this.$accessor.user.fetchPersonnalAccountConsummers();
  },
  methods: {
    async transferMoney(): Promise<void> {
      if (!this.transfer.isValid) {
        return;
      }
      this.toggled = false;
      this.transfer.amount = this.transfer.amount.replace(",", ".");
      // transaction to self...
      if (this.transfer.user.id == this.me.id) {
        this.$accessor.notif.pushNotification({
          message:
            "Trouve toi des amis plutôt que de faire des virements a toi même...",
        });
        return;
      }

      if (
        +this.transfer.amount <= 0 ||
        +this.transfer.amount.toString().split(".")[1]?.length > 2
      ) {
        this.$accessor.notif.pushNotification({
          message: "C'est plus assomaker...",
        });
        return;
      }

      if (this.transfer.user.id) {
        try {
          let newTransfer: Partial<Transfer> = {
            amount: +this.transfer.amount,
            context: this.transfer.reason,
            from: this.me.id,
            to: this.transfer.user.id,
          };
          await this.$accessor.transaction.addTransaction(newTransfer);
          this.$emit("transaction", newTransfer.amount);
          //reset form data
          this.transfer = {
            user: { username: undefined, id: 0 },
            amount: "0",
            reason: "",
            isValid: false,
          };
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
});
</script>

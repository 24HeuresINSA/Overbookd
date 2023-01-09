<template>
  <v-dialog v-model="toggled" :retain-focus="false" max-width="600">
    <v-card>
      <v-card-title>Effectuer un virement</v-card-title>
      <v-card-text>
        <v-form v-model="transfer.isValid">
          <v-autocomplete
            v-model="transfer.user"
            :items="users"
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
import { mapState } from "vuex";
import { DialogState } from "~/store/dialog";
import { UserState } from "~/store/user";
import { Transfer } from "~/utils/models/repo";
import { TMapState } from "~/utils/types/store";

export default Vue.extend({
  name: "TransferDialog",

  data: () => {
    return {
      transfer: {
        user: {
          username: undefined,
          id: "",
        },
        amount: "0",
        reason: "",
        isValid: false,
      },
      users: [] as any[],
    };
  },
  computed: {
    ...mapState<any, TMapState<DialogState>>("dialog", {
      type: (state: DialogState) => state.type,
      open: (state: DialogState) => state.open,
    }),
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state: UserState) => state.me,
    }),
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
  },
  async mounted() {
    let users = this.$accessor.user.usernames;
    if (users.length === 0) {
      // fetch usernames
      await this.$accessor.user.fetchUsernamesWithCP();
      users = this.$accessor.user.usernames;
    }
    // sort alphabetically
    this.users = users.map((user) => {
      return {
        text: user.username,
        value: user,
      } as any;
    });
  },
  methods: {
    async transferMoney(): Promise<any> {
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
            user: { username: undefined, id: "" },
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

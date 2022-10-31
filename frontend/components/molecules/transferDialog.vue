<template>
  <v-dialog v-model="toggled" :retain-focus="false" max-width="600">
    <v-card>
      <v-card-title>Effectuer un virement</v-card-title>
      <v-card-text>
        <v-form v-model="formData.isValid">
          <v-autocomplete
            v-model="formData.user"
            :items="users"
            label="Utilisateur"
            required
            dense
          ></v-autocomplete>

          <v-text-field
            v-model="formData.amount"
            type="number"
            label="Montant"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="formData.reason"
            label="Raison"
          ></v-text-field>
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
import { TMapState } from "~/utils/types/store";
import { Transfer } from "~/utils/models/repo";

export default Vue.extend({
  name: "TransferDialog",

  data: () => {
    return {
      formData: {
        user: {
          username: undefined,
          id: "",
        },
        amount: "0",
        reason: "",
        isValid: false
      },
      users: {},
    };
  },
  async mounted() {
    let users = this.$accessor.user.usernames;
    if (users.length === 0) {
      // fetch usernames
      await this.$accessor.user.getUsername("");
      users = this.$accessor.user.usernames;
    }
    // sort alphabetically
    this.users = users.map((user) => {
      return {
        text: user.username,
        value: user,
      };
    });
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
  methods: {
    async transferMoney() {
      this.formData.amount = this.formData.amount.replace(",", ".");
      console.log(this.formData);
      if (!this.formData.user.id) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message:
            "N'oublie pas de choisir le bénéficiaire !",
        });
        return;
      }

      // transaction to self...
      else if (this.formData.user.id == this.me.id) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message:
            "Trouve toi des amis plutôt que de faire des virements a toi même...",
        });
        return;
      }

      else if (+this.formData.amount <= 0) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "C'est plus assomaker...",
        });
        return;
      }

      else {
        try {
          let newTransfer: Partial<Transfer> = {
            amount: +this.formData.amount,
            context: this.formData.reason,
            from: this.me.id,
            to: this.formData.user.id,
          };
          await this.$accessor.transaction.addTransaction(newTransfer);
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
});
</script>

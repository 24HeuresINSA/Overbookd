<template>
  <v-dialog v-model="toggled" :retain-focus="false" max-width="600">
    <v-card>
      <v-card-title>Effectuer un virement</v-card-title>
      <v-card-text>
        <OverForm :fields="transferForm" @form-change="onFormChange">
        </OverForm>
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
import OverForm from "~/components/overForm.vue";
import { RepoFactory } from "~/repositories/repoFactory";

export default Vue.extend({
  name: "TransferDialog",
  components: { OverForm },
  data() {
    return {
      transferForm: [
        {
          key: "user",
          type: "user",
          isRequired: true,
        },
        {
          key: "amount",
          label: "montant",
          option: "number",
          isRequired: true,
        },
        {
          key: "reason",
          label: "raison",
        },
      ],
      transfer: {
        reason: "",
        amount: "0",
        beneficiary: {
          username: undefined,
          keycloakID: "",
        },
        isValid: false,
        user: {} as any,
      },
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
  methods: {
    onFormChange(form: any) {
      this.transfer = form;
    },
    async transferMoney(): Promise<any> {
      this.toggled = false;
      this.transfer.amount = this.transfer.amount.replace(",", ".");
      if (this.transfer.isValid) {
        // transaction to self...
        if (this.transfer.user.keycloakID == this.me.keycloakID) {
          this.$accessor.notif.pushNotification({
            type: "error",
            message: "Ca sert a rien de se transférer de l'argent soi-même...",
          });
          return;
        }

        if (this.transfer.user.keycloakID) {
          const transactionRepo = RepoFactory.transactionRepo;

          try {
            let res = await transactionRepo.createTransfer(this, {
              amount: +this.transfer.amount,
              context: this.transfer.reason,
              createdAt: new Date(),
              from: this.me.keycloakID,
              to: this.transfer.user.keycloakID,
              type: "transfer",
            });

            if (res.status == 200) {
              // add notification
            }
          } catch (e) {
            console.error(e);
          }
        }

        //TODO: Broken. Fix
        //TODO: Update balance ?
        // try {
        //   let res = await RepoFactory.userRepo.transfer(this, this.transfer);
        //   if (res.status !== 200) {
        //     throw new Error();
        //   }
        //   let notif: SnackNotif = {
        //     type: "success",
        //     message: "Transfer sent !",
        //   };
        //   this.$store.dispatch("notif/pushNotification", notif);
        // } catch (error: any) {
        //   let notif: SnackNotif = {
        //     type: "error",
        //     message: "Could not transfer",
        //   };
        //   await this.$store.dispatch("notif/pushNotification", notif);
        // }
      }
    },
  },
});
</script>

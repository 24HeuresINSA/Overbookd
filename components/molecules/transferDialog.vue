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
import { TMapState } from "~/utils/types/store";
import OverForm from "~/components/overForm.vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { SnackNotif } from "~/utils/models/store";
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
          isRequired: true,
        },
        {
          key: "reason",
          label: "raison",
        },
      ],
      transfer: {
        reason: "",
        amount: 0,
        beneficiary: undefined,
        isValid: false,
        user: null as any,
      },
      user: null as any,
    };
  },
  computed: {
    ...mapState<any, TMapState<DialogState>>("dialog", {
      type: (state: DialogState) => state.type,
      open: (state: DialogState) => state.open,
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
    //TODO no any
    onFormChange(form: any) {
      this.transfer = form;
    },
    async transferMoney() {
      this.toggled = false;
      //TODO: check all logic
      if (this.transfer.isValid) {
        if (
          this.transfer.user ===
          this.user.firstname + "." + this.user.lastname
        ) {
          return;
        }
        this.user.balance -= +this.transfer.amount;
        if (!this.user.transactionHistory) {
          this.user.transactionHistory = [];
        }
        this.user.transactionHistory.unshift({
          amount: this.transfer.amount,
          reason: `virement pour ${this.transfer.user}, ${this.transfer.reason}`,
        });

        try {
          let res = await RepoFactory.get("user").transfer(this, this.transfer);
          if (res.status !== 200) {
            throw new Error("Server did not return 200 status");
          }
          let notif: SnackNotif = {
            type: "success",
            message: "Transfer sent !",
          };
          this.$store.dispatch("notif/pushNotification", notif);
        } catch (error: any) {
          let notif: SnackNotif = {
            type: "error",
            message: "Could not transfer",
          };
          this.$store.dispatch("notif/pushNotification", notif);
        }
      }
    },
  },
});
</script>

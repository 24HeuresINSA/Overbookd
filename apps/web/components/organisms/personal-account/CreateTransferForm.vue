<template>
  <v-card class="transfer">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Faire un virement</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="fields">
          <MoneyField v-model="amount" label="Montant du virement" :min="1" />
          <SearchUser v-model="payee" label="Bénéficiaire" />
          <v-text-field v-model="context" label="Motif" />
        </div>
        <v-btn
          color="success"
          dark
          large
          :disabled="!isTransferValid"
          @click="sendTransfer"
        >
          <v-icon left> mdi-send </v-icon>
          Envoyer le virement
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";
import { UserPersonalData } from "@overbookd/user";

interface CreateTransferFormData {
  amount: number;
  payee: UserPersonalData | null;
  context: string;
}

export default defineComponent({
  name: "CreateTransferForm",
  components: { SearchUser, MoneyField },
  data: (): CreateTransferFormData => ({
    amount: 100,
    payee: null,
    context: "",
  }),
  computed: {
    isTransferValid(): boolean {
      return this.amount > 0 && this.payee !== null && this.context !== "";
    },
  },
  methods: {
    async sendTransfer() {
      if (!this.isTransferValid) return;

      await this.$accessor.transaction.sendTransfer({
        amount: this.amount,
        to: this.payee?.id as number,
        context: this.context,
      });
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.transfer {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .fields {
      width: 80%;
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>

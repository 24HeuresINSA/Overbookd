<template>
  <div class="forget">
    <v-card class="forget-card">
      <v-card-title>Supprimer toutes les données me concernant</v-card-title>
      <v-card-subtitle>Tout doit disparaitre 💨</v-card-subtitle>
      <v-card-text>
        <form>
          <fieldset>
            <legend>Mes identifiants</legend>
            <v-text-field
              v-model="email"
              label="Email*"
              name="email"
              autocomplete="email"
              inputmode="email"
              required
              :rules="[rules.required, rules.email, rules.insaEmail]"
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="Mot de passe*"
              required
              :rules="[rules.required]"
            ></v-text-field>
          </fieldset>
          <v-checkbox
            v-model="confirm"
            label="Cette suppression est définitive et irreversible, je comprends que je devrais me créer un nouveau compte si je souhaite utiliser à nouveau Overbookd"
            color="success"
            hide-details
            required
          ></v-checkbox>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!isValid" @click="forgetMe">
          Oubliez moi !
        </v-btn>
      </v-card-actions>
    </v-card>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { InputRulesData, isEmail, required } from "~/utils/rules/input.rules";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

type ForgetData = InputRulesData & {
  password: string;
  email: string;
  confirm: boolean;
}

export default Vue.extend({
  name: "Forget",
  auth: false,
  components: { SnackNotificationContainer },
  layout: "none",
  data: (): ForgetData => {
    return {
      password: "",
      email: "",
      confirm: false,
      rules: {
        email: isEmail,
        required,
      },
    };
  },
  computed: {
    token(): string {
      const token = this.$route.query.token;
      if (Array.isArray(token)) return "";

      return token ?? "";
    },
    isValid(): boolean {
      const isValidEmail = this.rules.email(this.email) === true;
      const isValidPassword = this.rules.required(this.password) === true;
      return isValidEmail && isValidPassword && this.confirm;
    },
  },
  methods: {
    forgetMe() {
      this.$accessor.registration.forgetMe({
        credentials: { email: this.email, password: this.password },
        token: this.token,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.forget {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  fieldset {
    display: flex;
    gap: 40px;
    align-items: center;
    padding: 10px;
    @media (width <= 900px) {
      gap: 3px;
      flex-direction: column;
    }
  }
}
</style>

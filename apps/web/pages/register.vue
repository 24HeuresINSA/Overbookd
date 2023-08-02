<template>
  <div class="register">
    <v-img
      src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg"
      class="img-background"
    ></v-img>
    <v-card class="register-card">
      <v-img
        class="register-illustration"
        src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg"
      >
        <v-card-title class="register-title"> 👋 Inscription 👋 </v-card-title>
      </v-img>
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1" @click="step = 1">
          Devenir Bénévole
          <small>Tout ce qu'il faut savoir sur le festival</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          {{ registerDescription } }}
          <v-btn color="primary" @click="step = 2"> C'est parti ! 🚀 </v-btn>
          <v-btn text @click="returnToLogin"> Annuler </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="step > 2"
          step="2"
          :rules="presentationRules"
          @click="step = 2"
        >
          Présentation
          <small>Dis nous en un peu plus sur toi</small>
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-form class="data dense personnal-data">
            <v-text-field
              v-model="firstname"
              label="Prénom*"
              required
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field v-model="nickname" label="Surnom"></v-text-field>
            <v-text-field
              v-model="lastname"
              label="Nom*"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="birthday"
              label="Date de naissance*"
              type="date"
              :rules="[
                rules.required,
                rules.birthdayMaxDate,
                rules.birthdayMinDate,
              ]"
            >
            </v-text-field>
          </v-form>
          <v-btn color="primary" @click="step = 3"> Vous savez tout 🕵️</v-btn>
          <v-btn text @click="step = 1"> Revenir</v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="step > 3"
          step="3"
          :rules="contactRules"
          @click="step = 3"
        >
          Contact
          <small>Comment on reste connectés ?</small>
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-form class="data contact-data">
            <v-text-field
              v-model="email"
              label="Email*"
              required
              hint="Pas d'adresse insa 🙏"
              :rules="[rules.required, rules.email, rules.insaEmail]"
              persistent-hint
            ></v-text-field>
            <v-text-field
              v-model="phone"
              label="Ton 06 ?*"
              required
              :rules="[rules.required, rules.mobilePhone]"
            ></v-text-field>
            <v-select
              v-if="isOpenToSoft"
              v-model="teamId"
              label="Équipe"
              :items="softCreationTeams"
              item-text="name"
              item-value="id"
              clearable
              hint="Tu nous rejoins à plusieurs ?"
              persistent-hint
            ></v-select>
            <v-textarea
              v-model="comment"
              label="Commentaire"
              hint="Laisse nous un petit mot. 💌"
              persistent-hint
            ></v-textarea>
          </v-form>
          <v-btn color="primary" @click="step = 4"> On se capte 🤙 </v-btn>
          <v-btn text @click="step = 2"> Revenir </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4" @click="step = 4">
          Sécurité <small>Un mot de passe</small>
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-form class="data security-data">
            <v-text-field
              v-model="password"
              type="password"
              label="Mot de passe*"
              required
              hint="Au moins une MAJUSCULE, minuscule, un chiffre et 6 caractères 🔒"
              persistent-hint
              :rules="[rules.password]"
            ></v-text-field>

            <v-text-field
              v-model="repeatPassword"
              type="password"
              label="Confirme ton mot de passe*"
              required
              :rules="[repeatPasswordRule]"
            ></v-text-field>
          </v-form>
          <v-btn color="primary" :disabled="isFormInvalid" @click="register">
            M'inscrire
          </v-btn>
          <v-btn text @click="step = 3"> Revenir </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-card>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { Team } from "~/utils/models/team";
import { UserCreation } from "~/utils/models/user";
import {
  InputRulesData,
  required,
  minDate,
  maxDate,
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  password,
  isSame,
} from "~/utils/rules/inputRules";

interface RegisterData extends InputRulesData {
  step: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  birthday: string;
  teamId?: number;
  phone: string;
  comment?: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default Vue.extend({
  name: "Register",
  auth: false,
  components: { SnackNotificationContainer },
  layout: "none",
  data(): RegisterData {
    return {
      step: 1,
      firstname: "",
      lastname: "",
      nickname: undefined,
      birthday: "2000-01-01",
      email: "",
      phone: "",
      comment: undefined,
      teamId: undefined,
      password: "",
      repeatPassword: "",
      rules: {
        required: required,
        birthdayMinDate: minDate(new Date("1950-01-01")),
        birthdayMaxDate: maxDate(),
        email: isEmail,
        insaEmail: isInsaEmail,
        mobilePhone: isMobilePhoneNumber,
        password: password,
      },
    };
  },
  computed: {
    birthdayDate(): Date {
      return new Date(this.birthday);
    },
    softCreationTeams(): Team[] {
      const emptyTeam = { id: 0, name: "Aucune" } as Team;
      return [...this.$accessor.team.softCreationTeams, emptyTeam];
    },
    presentationRules(): (() => boolean | string)[] {
      return [
        () => this.step <= 2 || this.rules.required(this.firstname),
        () => this.step <= 2 || this.rules.required(this.lastname),
        () => this.step <= 2 || this.rules.required(this.birthday),
        () => this.step <= 2 || this.rules.birthdayMaxDate(this.birthday),
        () => this.step <= 2 || this.rules.birthdayMinDate(this.birthday),
      ];
    },
    contactRules(): (() => boolean | string)[] {
      return [
        () => this.step <= 3 || this.rules.required(this.email),
        () => this.step <= 3 || this.rules.required(this.phone),
        () => this.step <= 3 || this.rules.email(this.email),
        () => this.step <= 3 || this.rules.insaEmail(this.email),
        () => this.step <= 3 || this.rules.mobilePhone(this.phone),
      ];
    },
    securityRules(): (() => boolean | string)[] {
      return [
        () => this.step <= 3 || this.rules.required(this.password),
        () => this.step <= 3 || this.rules.password(this.password),
      ];
    },
    repeatPasswordRule(): (value: string | null) => boolean | string {
      return isSame(this.password);
    },
    isFormInvalid(): boolean {
      return (
        this.presentationRules.some((rule) => rule() !== true) ||
        this.contactRules.some((rule) => rule() !== true) ||
        this.securityRules.some((rule) => rule() !== true) ||
        this.repeatPasswordRule(this.repeatPassword) !== true
      );
    },
    mUser(): UserCreation {
      return {
        firstname: this.firstname,
        lastname: this.lastname,
        nickname: this.nickname,
        birthdate: this.birthdayDate,
        email: this.email,
        phone: this.phone,
        comment: this.comment,
        teamId: this.teamId === 0 ? undefined : this.teamId,
        password: this.password,
      };
    },
    registerDescription(): string {
      return this.$accessor.configuration.registerFormDescription;
    },
  },
  async created() {
    await this.$accessor.team.setTeamsInStore();
    await this.$accessor.configuration.fetchAll();
  },
  methods: {
    async register() {
      const res = await this.$accessor.user.createUser(this.mUser);
      if (!res) return;
      await this.$auth.loginWith("local", {
        data: { email: this.email, password: this.password },
      });
      await this.$router.push({
        path: "/",
      });
    },
    returnToLogin() {
      this.$router.push("/login");
    },
  },
});
</script>

<style scoped lang="scss">
.img-background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  padding: 0;
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &-card {
    max-width: 1000px;
    width: 100%;
  }

  &-illustration {
    height: 20vh;
    min-height: 100px;
    max-height: 350px;
  }

  &-title {
    color: #ffffff;
    position: absolute;
    width: 100%;
    bottom: 0px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    justify-content: center;
  }

  .data {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &.dense {
      gap: 0px;
    }
  }
}
</style>

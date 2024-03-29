<template>
  <div class="register">
    <v-img
      src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg"
      class="img-background"
    ></v-img>
    <v-alert
      v-if="isInvitationExpired"
      icon="mdi-alert-octagon-outline"
      prominent
      type="error"
      class="alert"
    >
      <p>
        Le lien pour s'inscrire en tant qu'organisateur n'est pas valable.
        <br />
        Contacte
        <a href="mailto:secretaire.general@24heures.org">
          le.a secrétaire général.e.
        </a>
        pour recevoir un nouveau lien
      </p>
      <p>
        Si tu veux t'inscrire en tant que bénévole sur le festival c'est par
        <nuxt-link to="/register">ici</nuxt-link>
      </p>
    </v-alert>
    <v-card class="register-card">
      <v-img
        class="register-illustration"
        src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg"
      >
        <v-card-title class="register-title">
          👋 Inscription {{ membership }} 👋
        </v-card-title>
      </v-img>
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1" @click="step = 1">
          Devenir {{ membership }}
          <small>Tout ce qu'il faut savoir sur le festival</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <div v-if="isVolunteerRegistration">
            <p>Hello et merci d'être venu jusqu'ici ! 🤗</p>
            <p>
              Le festival des 24 heures de l'INSA n'est possible que grâce aux
              plus de <strong>350 bénévoles</strong> qui, comme toi, ont accepté
              de venir nous donner un coup de main pour préparer, organiser et
              faire en sorte que les festivaliers passent le meilleur moment
              possible. 🎉
            </p>
            <p>
              Pour que l'on puisse t'accueillir dans les meilleures conditions
              il nous faut cependant quelques informations sur toi et le temps
              que tu souhaites consacrer à nous aider.
            </p>
            <p>
              Si tu as la moindre question sur le festival et ce que tu peux
              faire pour nous aider, n'hésite pas à
              <a href="mailto:humains@24heures.org">
                contacter les responsables bénévoles
              </a>
              .
              <br />Ils seront tes principaux interlocuteurs en amont et en aval
              du festival. 😎
            </p>
          </div>
          <div v-else v-safe-html="registerDescription"></div>
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
          <v-form class="data dense personal-data">
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
              name="email"
              autocomplete="email"
              inputmode="email"
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
              v-model="teams"
              multiple
              label="Équipes"
              :items="comingFromTeams"
              item-text="name"
              item-value="code"
              clearable
              hint="Tu nous rejoins à plusieurs ?"
              persistent-hint
              :rules="[twoTeamsMaximumRule]"
            ></v-select>
            <CommentField v-model="comment" />
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
              hint="Au moins une MAJUSCULE, minuscule, un chiffre, un caractères spécial et 12 caractères 🔒"
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
import {
  BDE_CODE,
  KARNA_CODE,
  KFET_CODE,
  RegisterForm,
  STRASBOURG_CODE,
  TECKOS_CODE,
  TENDRESTIVAL_CODE,
  TeamCode,
  Teams,
  CVL_CODE,
  InviteStaff,
  LINK_EXPIRED,
} from "@overbookd/registration";
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
  maxLength,
} from "~/utils/rules/input.rules";
import CommentField from "~/components/atoms/field/comment/CommentField.vue";

type RegisterData = InputRulesData & {
  step: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  birthday: string;
  teams: Teams;
  phone: string;
  comment?: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export default Vue.extend({
  name: "Register",
  auth: false,
  components: { SnackNotificationContainer, CommentField },
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
      teams: [],
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
    token(): string | undefined {
      const token = this.$route.query.token;
      if (Array.isArray(token)) return undefined;

      return token ?? undefined;
    },
    isInvitationExpired(): boolean {
      if (!this.token) return false;

      const currentUrl = new URL(window.location.href);
      return InviteStaff.isLinkExpired(currentUrl) === LINK_EXPIRED;
    },
    isVolunteerRegistration(): boolean {
      return this.token === undefined;
    },
    cleanComment(): string | undefined {
      if (!this.comment) return undefined;
      return this.comment;
    },
    membership(): string {
      return this.isVolunteerRegistration ? "Bénévole" : "Organisateur";
    },
    cleanNickname(): string | undefined {
      if (!this.nickname) return undefined;
      return this.nickname;
    },
    registerForm(): RegisterForm {
      return this.commentAction(this.nicknameAction(RegisterForm.init()))
        .fillBirthdate(this.birthdayDate)
        .fillEmail(this.email)
        .fillFirstname(this.firstname)
        .fillLastname(this.lastname)
        .fillMobilePhone(this.phone)
        .fillTeams(this.teams)
        .fillPassword(this.password);
    },
    birthdayDate(): Date {
      return new Date(this.birthday);
    },
    comingFromTeams(): TeamCode[] {
      return [
        BDE_CODE,
        STRASBOURG_CODE,
        KFET_CODE,
        KARNA_CODE,
        CVL_CODE,
        TECKOS_CODE,
        TENDRESTIVAL_CODE,
      ];
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
    twoTeamsMaximumRule(): (value: unknown[] | null) => boolean | string {
      return maxLength(2);
    },
    isFormInvalid(): boolean {
      return (
        this.presentationRules.some((rule) => rule() !== true) ||
        this.contactRules.some((rule) => rule() !== true) ||
        this.securityRules.some((rule) => rule() !== true) ||
        this.repeatPasswordRule(this.repeatPassword) !== true ||
        this.registerForm.reasons.length > 0
      );
    },
    registerDescription(): string {
      return this.$accessor.configuration.registerFormDescription;
    },
  },
  async created() {
    await this.$accessor.team.fetchTeams();
    await this.$accessor.configuration.fetchAll();
  },
  methods: {
    commentAction(form: RegisterForm) {
      if (this.cleanComment === undefined) return form.clearComment();
      return form.fillComment(this.cleanComment);
    },
    nicknameAction(form: RegisterForm) {
      if (this.cleanNickname === undefined) return form.clearNickname();
      return form.fillNickname(this.cleanNickname);
    },
    async register() {
      const res = await this.$accessor.registration.register({
        token: this.token,
        form: this.registerForm,
      });
      if (!res) return;
      await this.$auth.loginWith("local", {
        data: { email: this.email, password: this.password },
      });
      this.$router.push("/");
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
.alert a {
  color: $yellow-24h;
}
</style>

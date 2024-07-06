<template>
  <v-card class="register-card">
    <v-img
      class="register-illustration"
      src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg"
      cover
    >
      <v-card-title class="register-title">
        👋 Inscription {{ membership }} 👋
      </v-card-title>
    </v-img>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item
          title="Devenir Bénévole"
          subtitle="Tout ce qu'il faut savoir sur le festival"
          :value="1"
          :complete="step > 1"
          class="stepper-header"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 1" direction="vertical">
        <v-stepper-window-item :value="1">
          <p>Hello et merci d'être venu jusqu'ici ! 🤗</p>
          <p>
            Le festival des 24 heures de l'INSA n'est possible que grâce aux
            plus de <strong>350 bénévoles</strong> qui, comme toi, ont accepté
            de venir nous donner un coup de main pour préparer, organiser et
            faire en sorte que les festivaliers passent le meilleur moment
            possible. 🎉
          </p>
          <p>
            Pour que l'on puisse t'accueillir dans les meilleures conditions il
            nous faut cependant quelques informations sur toi et le temps que tu
            souhaites consacrer à nous aider.
          </p>
          <p>
            Si tu as la moindre question sur le festival et ce que tu peux faire
            pour nous aider, n'hésite pas à
            <a :href="`mailto:${HUMAINS_EMAIL}`">
              contacter les responsables bénévoles
            </a>
            .
            <br />Ils seront tes principaux interlocuteurs en amont et en aval
            du festival. 😎
          </p>
          <div class="stepper-actions">
            <v-btn color="primary" @click="step = 2"> C'est parti ! 🚀 </v-btn>
            <v-btn variant="text" @click="returnToLogin"> Annuler </v-btn>
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-header>
        <v-stepper-item
          title="Présentation"
          subtitle="Dis nous en un peu plus sur toi"
          :value="2"
          :complete="step > 2"
          :rules="presentationRules"
          class="stepper-header"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 2" direction="vertical">
        <v-stepper-window-item :value="2">
          <v-form class="data dense personal-data">
            <v-text-field
              v-model="firstname"
              label="Prénom*"
              required
              :rules="[rules.required]"
            />
            <v-text-field v-model="nickname" label="Surnom" />
            <v-text-field
              v-model="lastname"
              label="Nom*"
              :rules="[rules.required]"
              required
            />
            <v-text-field
              v-model="birthday"
              label="Date de naissance*"
              type="date"
              :rules="[
                rules.required,
                rules.birthdayMaxDate,
                rules.birthdayMinDate,
              ]"
            />
            <CommentField v-model="comment" />
          </v-form>
          <div class="stepper-actions">
            <v-btn color="primary" @click="step = 3"> Vous savez tout 🕵️</v-btn>
            <v-btn variant="text" @click="step = 1"> Revenir</v-btn>
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-header>
        <v-stepper-item
          title="Contact"
          subtitle="Comment on reste connectés ?"
          :value="3"
          :complete="step > 3"
          :rules="contactRules"
          class="stepper-header"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 3" direction="vertical">
        <v-stepper-window-item :value="3">
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
            />
            <v-text-field
              v-model="phone"
              label="Ton 06 ?*"
              required
              :rules="[rules.required, rules.mobilePhone]"
            />
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
            />
          </v-form>
          <div class="stepper-actions">
            <v-btn color="primary" @click="step = 4"> On se capte 🤙 </v-btn>
            <v-btn variant="text" @click="step = 2"> Revenir </v-btn>
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-header>
        <v-stepper-item
          title="Sécurité"
          subtitle="Un mot de passe"
          :value="4"
          :complete="step > 4"
          class="stepper-header"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 4" direction="vertical">
        <v-stepper-window-item :value="4">
          <v-form class="data security-data">
            <v-text-field
              v-model="password"
              type="password"
              label="Mot de passe*"
              required
              hint="Au moins une MAJUSCULE, minuscule, un chiffre, un caractères spécial et 12 caractères 🔒"
              persistent-hint
              :rules="[rules.password]"
            />

            <v-text-field
              v-model="repeatPassword"
              type="password"
              label="Confirme ton mot de passe*"
              required
              :rules="[repeatPasswordRule]"
            />
          </v-form>
          <div class="stepper-actions">
            <v-btn color="primary" :disabled="isFormInvalid" @click="register">
              M'inscrire
            </v-btn>
            <v-btn variant="text" @click="step = 3"> Revenir </v-btn>
          </div>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-card>
</template>

<script lang="ts" setup>
import {
  BDE_CODE,
  KARNA_CODE,
  KFET_CODE,
  RegisterForm,
  STRASBOURG_CODE,
  TECKOS_CODE,
  TENDRESTIVAL_CODE,
  type Teams,
  CVL_CODE,
} from "@overbookd/registration";
import {
  required,
  minDate,
  maxDate,
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  password as passwordRule,
  isSame,
  maxLength,
} from "~/utils/rules/input.rules";
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const registrationStore = useRegistrationStore();
const configurationStore = useConfigurationStore();

configurationStore.fetchAll();

const step = ref(1);
const firstname = ref("");
const lastname = ref("");
const nickname = ref("");
const birthday = ref("2000-01-01");
const email = ref("");
const phone = ref("");
const comment = ref("");
const teams = ref<Teams>([]);
const password = ref("");
const repeatPassword = ref("");

const rules = {
  required,
  birthdayMinDate: minDate(new Date("1950-01-01")),
  birthdayMaxDate: maxDate(),
  email: isEmail,
  insaEmail: isInsaEmail,
  mobilePhone: isMobilePhoneNumber,
  password: passwordRule,
};

const token = computed(() => {
  const tokenParam = route.query.token;
  return Array.isArray(tokenParam) ? undefined : tokenParam ?? undefined;
});

const isVolunteerRegistration = computed(() => !token.value);

const cleanComment = computed(() => comment.value || undefined);

const membership = computed(() =>
  isVolunteerRegistration.value ? "Bénévole" : "Organisateur",
);

const cleanNickname = computed(() => nickname.value || undefined);

const registerForm = computed(() => {
  return commentAction(nicknameAction(RegisterForm.init()))
    .fillBirthdate(birthdayDate.value)
    .fillEmail(email.value)
    .fillFirstname(firstname.value)
    .fillLastname(lastname.value)
    .fillMobilePhone(phone.value)
    .fillTeams(teams.value)
    .fillPassword(password.value);
});

const birthdayDate = computed(() => new Date(birthday.value));

const comingFromTeams = computed(() => [
  BDE_CODE,
  STRASBOURG_CODE,
  KFET_CODE,
  KARNA_CODE,
  CVL_CODE,
  TECKOS_CODE,
  TENDRESTIVAL_CODE,
]);

const presentationRules = computed(() => [
  () => step.value <= 2 || rules.required(firstname.value),
  () => step.value <= 2 || rules.required(lastname.value),
  () => step.value <= 2 || rules.required(birthday.value),
  () => step.value <= 2 || rules.birthdayMaxDate(birthday.value),
  () => step.value <= 2 || rules.birthdayMinDate(birthday.value),
]);

const contactRules = computed(() => [
  () => step.value <= 3 || rules.required(email.value),
  () => step.value <= 3 || rules.required(phone.value),
  () => step.value <= 3 || rules.email(email.value),
  () => step.value <= 3 || rules.insaEmail(email.value),
  () => step.value <= 3 || rules.mobilePhone(phone.value),
]);

const securityRules = computed(() => [
  () => step.value <= 3 || rules.required(password.value),
  () => step.value <= 3 || rules.password(password.value),
]);

const repeatPasswordRule = computed(() => isSame(password.value));

const twoTeamsMaximumRule = computed(() => maxLength(2));

const isFormInvalid = computed(() => {
  return (
    presentationRules.value.some((rule) => rule() !== true) ||
    contactRules.value.some((rule) => rule() !== true) ||
    securityRules.value.some((rule) => rule() !== true) ||
    repeatPasswordRule.value(repeatPassword.value) !== true ||
    registerForm.value.reasons.length > 0
  );
});

const commentAction = (form: RegisterForm) => {
  if (!cleanComment.value) return form.clearComment();
  return form.fillComment(cleanComment.value);
};

const nicknameAction = (form: RegisterForm) => {
  if (!cleanNickname.value) return form.clearNickname();
  return form.fillNickname(cleanNickname.value);
};

const register = async () => {
  const res = await registrationStore.register(registerForm.value, token.value);
  if (!res) return;
  await authStore.login({
    email: email.value,
    password: password.value,
  });
  router.push("/");
};

const returnToLogin = () => {
  router.push("/login");
};
</script>

<style scoped lang="scss">
.register {
  &-card {
    max-width: 1000px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 2;
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
    text-align: center;
  }
}

.stepper {
  &-header {
    text-align: start;
  }

  &-actions {
    display: flex;
    gap: 5px;
    margin-top: 1em;
  }
}

.data {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &.dense {
    gap: 0px;
  }
}
</style>

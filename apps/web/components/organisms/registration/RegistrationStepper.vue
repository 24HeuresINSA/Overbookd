<template>
  <v-card class="register-card" theme="loginTheme">
    <v-img
      class="register-illustration"
      src="/registration/volunteer_back_main_stage.jpg"
      alt="Un bénévole de dos devant la grande scène de la 50ème édition des 24 heures de l'INSA"
      cover
    >
      <v-card-title class="register-title">
        👋 Inscription {{ membershipLabel }} 👋
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
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 1" direction="vertical">
        <v-stepper-window-item :value="1">
          <div v-html-safe="registerFormDescription" />

          <div class="stepper-actions">
            <v-btn text="C'est parti ! 🚀" color="primary" @click="step = 2" />
            <v-btn
              text="Annuler"
              variant="text"
              @click="navigateTo(LOGIN_URL)"
            />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-header>
        <v-stepper-item
          title="Mon compte"
          :value="2"
          :complete="step > 2"
          :rules="accountStepRules"
          class="stepper-header"
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 2" direction="vertical">
        <v-stepper-window-item :value="2">
          <v-form class="stepper-form">
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
              v-show="registerForm.needsPassword"
              v-model="password"
              type="password"
              label="Mot de passe*"
              required
              hint="Au moins une MAJUSCULE, minuscule, un chiffre, un caractères spécial et 12 caractères 🔒"
              persistent-hint
              :rules="[rules.password]"
            />
            <v-text-field
              v-show="registerForm.needsPassword"
              v-model="repeatPassword"
              type="password"
              label="Confirme ton mot de passe*"
              required
              :rules="[repeatPasswordRule]"
            />
          </v-form>

          <div class="stepper-actions">
            <v-btn
              text="Dis-nous en plus sur toi !"
              color="primary"
              :disabled="false"
              @click="step = 3"
            />
            <v-btn text="Revenir" variant="text" @click="step = 1" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-header>
        <v-stepper-item
          title="Mes infos"
          :value="3"
          :complete="step > 3"
          :rules="userInfoRules"
          class="stepper-header"
        />
      </v-stepper-header>

      <v-stepper-window v-show="step == 3" direction="vertical">
        <v-stepper-window-item :value="3">
          <v-form class="stepper-form">
            <v-text-field
              v-model="firstName"
              label="Prénom*"
              required
              :rules="[rules.required]"
            />
            <v-text-field v-model="nickname" label="Surnom" />
            <v-text-field
              v-model="lastName"
              label="Nom*"
              :rules="[rules.required]"
              required
            />
            <v-text-field
              v-model="birthDay"
              label="Date de naissance*"
              type="date"
              :rules="[
                rules.required,
                rules.birthdayMaxDate,
                rules.birthdayMinDate,
              ]"
            />
            <v-text-field
              v-model="phoneNumber"
              label="Ton 06 ?*"
              required
              :rules="[rules.required, rules.mobilePhone]"
            />
            <v-select
              v-model="teams"
              multiple
              label="Équipes"
              :items="comingFromTeams"
              item-title="name"
              item-value="code"
              clearable
              hint="Laisse le champ vide si tu n'es pas dans une équipe 😉"
              persistent-hint
              :rules="[twoTeamsMaximumRule]"
            />
            <CommentField v-model="comment" />
          </v-form>
          <v-checkbox
            v-model="hasApprovedEULA"
            color="primary"
            density="comfortable"
            hide-details
          >
            <template #label>
              <div>
                Je reconnais avoir lu et compris les
                <span
                  v-tooltip:top="'Lire les Conditions Générales d\'Utilisation'"
                  class="eula-link"
                  @click.stop="openEULADialog"
                >
                  CGU
                </span>
                et je les accepte.
              </div>
            </template>
          </v-checkbox>
          <v-btn
            v-if="mustSignVolunteerCharter"
            class="charter-btn"
            :variant="hasSignedVolunteerCharter ? 'flat' : 'outlined'"
            :color="hasSignedVolunteerCharter ? 'success' : 'primary'"
            @click="openVolunteerCharterDialog"
          >
            {{
              hasSignedVolunteerCharter
                ? "Charte signée ✔"
                : "Lire et signer la charte bénévole"
            }}
          </v-btn>

          <div class="stepper-actions">
            <v-btn
              text="Valider mon inscription"
              color="primary"
              :disabled="isFormInvalid"
              :loading="loading"
              @click="register"
            />
            <v-btn text="Revenir" variant="text" @click="step = 2" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-card>

  <v-dialog
    v-model="isEULADialogOpen"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <EULADialogCard @close="closeEULADialog" />
  </v-dialog>

  <v-dialog
    v-model="isVolunteerCharterDialogOpen"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <VolunteerCharterDialogCard
      :has-signed="hasSignedVolunteerCharter"
      @close="closeVolunteerCharterDialog"
      @sign="signVolunteerCharter"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  RegisterForm,
  type RegistrationTeams,
  REGISTRATION_TEAM_CODES,
  type RegistrationTeamCode,
  type Membership,
  shouldSignVolunteerCharter,
  STAFF,
  VOLUNTEER,
  PASSWORD_NOT_REQUIRED,
} from "@overbookd/registration";
import { LOGIN_URL } from "@overbookd/web-page";
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
import { navigateTo } from "#app";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import { REGISTER_FORM_KEY } from "@overbookd/configuration";
import { planJauneAudioPlay } from "~/utils/easter-egg/jaune-audio";
import { planMembershipApplication } from "~/utils/registration/membership-application.utils";

const route = useRoute();
const registrationStore = useRegistrationStore();
const configurationStore = useConfigurationStore();
const teamStore = useTeamStore();

configurationStore.fetch(REGISTER_FORM_KEY);
const registerFormDescription = computed<string>(
  () => configurationStore.registerFormDescription,
);

const step = ref<number>(1);
const email = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const nickname = ref<string>("");
const birthDay = ref<string>("2000-01-01");
const phoneNumber = ref<string>("");
const comment = ref<string>("");
const teams = ref<RegistrationTeams>([]);
const hasApprovedEULA = ref<boolean>(false);
const hasSignedVolunteerCharter = ref<boolean>(false);

const rules = {
  required,
  birthdayMinDate: minDate(new Date("1950-01-01")),
  birthdayMaxDate: maxDate(),
  email: isEmail,
  insaEmail: isInsaEmail,
  mobilePhone: isMobilePhoneNumber,
  password: passwordRule,
};

const token = computed<string>(() => stringifyQueryParam(route.query.token));
const isVolunteerRegistration = computed<boolean>(() => !token.value);

const membership = computed<Membership>(() =>
  isVolunteerRegistration.value ? VOLUNTEER : STAFF,
);
const membershipLabel = computed<string>(() =>
  membership.value === STAFF ? "Organisateur" : "Bénévole",
);
const mustSignVolunteerCharter = computed(() =>
  shouldSignVolunteerCharter(membership.value),
);

const registerForm = computed<RegisterForm>(() => {
  const form = RegisterForm.initFor(membership.value, PASSWORD_NOT_REQUIRED)
    .fillBirthDate(new Date(birthDay.value))
    .fillEmail(email.value)
    .fillFirstName(firstName.value)
    .fillLastName(lastName.value)
    .fillNickname(nickname.value)
    .fillMobilePhone(phoneNumber.value)
    .fillTeams(teams.value)
    .fillComment(comment.value);
  const withPassword = form.needsPassword
    ? form.fillPassword(password.value)
    : form;
  const withEULA = hasApprovedEULA.value
    ? withPassword.approveEndUserLicenceAgreement()
    : withPassword.denyEndUserLicenceAgreement();
  return hasSignedVolunteerCharter.value
    ? withEULA.signVolunteerCharter()
    : withEULA.denyVolunteerCharter();
});

type TeamForRegistration = { name: string; code: RegistrationTeamCode };
const comingFromTeams = computed<TeamForRegistration[]>(() => {
  return REGISTRATION_TEAM_CODES.map((code) => {
    const team = teamStore.getTeamByCode(code);
    return team ? { name: team.name, code: team.code } : undefined;
  }).filter((team): team is TeamForRegistration => team !== undefined);
});

const emailRules = computed(() => [
  () => step.value <= 3 || rules.required(email.value),
  () => step.value <= 3 || rules.email(email.value),
  () => step.value <= 3 || rules.insaEmail(email.value),
]);

const passwordRules = computed(() =>
  registerForm.value.needsPassword
    ? [
        () => step.value <= 2 || rules.required(password.value),
        () => step.value <= 2 || rules.password(password.value),
      ]
    : [],
);
const accountStepRules = computed(() => [
  ...emailRules.value,
  ...passwordRules.value,
]);

const userInfoRules = computed(() => [
  () => step.value <= 3 || rules.required(firstName.value),
  () => step.value <= 3 || rules.required(lastName.value),
  () => step.value <= 3 || rules.required(birthDay.value),
  () => step.value <= 3 || rules.birthdayMaxDate(birthDay.value),
  () => step.value <= 3 || rules.birthdayMinDate(birthDay.value),
  () => step.value <= 3 || rules.required(phoneNumber.value),
  () => step.value <= 3 || rules.mobilePhone(phoneNumber.value),
  () => step.value <= 3 || rules.required(hasApprovedEULA.value),
  () =>
    step.value <= 3 ||
    !mustSignVolunteerCharter.value ||
    rules.required(hasSignedVolunteerCharter.value),
]);

const twoTeamsMaximumRule = computed(() => maxLength(2));
const repeatPasswordRule = computed(() =>
  registerForm.value.needsPassword ? isSame(password.value) : () => true,
);

const isFormInvalid = computed<boolean>(() => {
  return (
    passwordRules.value.some((rule) => rule() !== true) ||
    userInfoRules.value.some((rule) => rule() !== true) ||
    repeatPasswordRule.value(repeatPassword.value) !== true ||
    registerForm.value.reasons.length > 0
  );
});

const loading = ref<boolean>(false);
const register = async () => {
  loading.value = true;
  const res = await registrationStore.register(registerForm.value, token.value);
  if (!res) {
    loading.value = false;
    return;
  }

  planJauneAudioPlay();
  planMembershipApplication(token.value);
  loading.value = false;
};

const isEULADialogOpen = ref<boolean>(false);
const openEULADialog = () => (isEULADialogOpen.value = true);
const closeEULADialog = () => (isEULADialogOpen.value = false);

const isVolunteerCharterDialogOpen = ref<boolean>(false);
const openVolunteerCharterDialog = () =>
  (isVolunteerCharterDialogOpen.value = true);
const closeVolunteerCharterDialog = () =>
  (isVolunteerCharterDialogOpen.value = false);
const signVolunteerCharter = () => {
  hasSignedVolunteerCharter.value = true;
  closeVolunteerCharterDialog();
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
    padding: 0 !important;
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

  &-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 5px;
  }
}

.eula-link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}

.charter-btn {
  height: calc(var(--v-btn-height) - 10px);
  padding: 0 10px;
}
</style>

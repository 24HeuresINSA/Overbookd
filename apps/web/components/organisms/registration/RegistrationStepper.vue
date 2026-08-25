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
              :disabled="emailChecked"
              required
              hint="Pas d'adresse insa 🙏"
              :rules="[rules.required, rules.email, rules.insaEmail]"
              persistent-hint
              @enter="checkEmail"
            />
          </v-form>

          <div class="stepper-actions mb-4">
            <v-btn
              :text="emailChecked ? 'Changer de compte' : 'Vérifier mon email'"
              color="primary"
              :variant="emailChecked ? 'outlined' : 'elevated'"
              :disabled="
                !emailChecked && emailRules.some((rule) => rule() !== true)
              "
              @click="() => (emailChecked ? logout() : checkEmail())"
            />
            <v-btn
              v-show="!emailChecked"
              text="Revenir"
              variant="text"
              @click="step = 1"
            />
          </div>

          <v-form v-show="registerForm.needsPassword" class="stepper-form mt-6">
            <v-text-field
              v-model="password"
              type="password"
              label="Mot de passe*"
              hint="Au moins une MAJUSCULE, minuscule, un chiffre, un caractères spécial et 12 caractères 🔒"
              :rules="[rules.password]"
              persistent-hint
              required
            />
            <v-text-field
              v-model="repeatPassword"
              type="password"
              label="Confirme ton mot de passe*"
              :rules="[repeatPasswordRule]"
              required
            />
          </v-form>

          <div v-show="emailChecked" class="stepper-actions">
            <v-btn
              text="Dis-nous en plus sur toi !"
              color="primary"
              :disabled="accountStepRules.some((rule) => rule() !== true)"
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
  type RegistrationAccountStatus,
  registrationAccountStatuses,
} from "@overbookd/registration";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";
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
import { hasRegistrationFormData, registrationSteps } from "@overbookd/http";
import { ONE_SECOND_IN_MS } from "@overbookd/time";

const route = useRoute();
const registrationStore = useRegistrationStore();
const configurationStore = useConfigurationStore();
const teamStore = useTeamStore();
const snackNotification = useSnackNotificationStore();
const oidc = useOidcAuth();
const myStore = useMyStore();

const DEFAULT_BIRTHDAY = "2000-01-01";

configurationStore.fetch(REGISTER_FORM_KEY);
const registerFormDescription = computed<string>(
  () => configurationStore.registerFormDescription,
);

const step = ref<number>(1);
const accountStatus = ref<RegistrationAccountStatus>(
  registrationAccountStatuses.EXISTING,
);
const emailChecked = ref<boolean>(false);

const email = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const nickname = ref<string>("");
const birthDay = ref<string>(DEFAULT_BIRTHDAY);
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
  const form = RegisterForm.initFor(membership.value, accountStatus.value)
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
  () => rules.required(email.value),
  () => rules.email(email.value),
  () => rules.insaEmail(email.value),
]);

const passwordRules = computed(() =>
  registerForm.value.needsPassword
    ? [
        () => rules.required(password.value),
        () => rules.password(password.value),
        () => rules.required(repeatPassword.value),
        () => isSame(password.value)(repeatPassword.value),
      ]
    : [],
);
const accountStepRules = computed(() => {
  if (step.value <= 2) return [];
  return [...emailRules.value, ...passwordRules.value];
});

const userInfoRules = computed(() => [
  () => step.value < 3 || rules.required(firstName.value),
  () => step.value < 3 || rules.required(lastName.value),
  () => step.value < 3 || rules.required(birthDay.value),
  () => step.value < 3 || rules.birthdayMaxDate(birthDay.value),
  () => step.value < 3 || rules.birthdayMinDate(birthDay.value),
  () => step.value < 3 || rules.required(phoneNumber.value),
  () => step.value < 3 || rules.mobilePhone(phoneNumber.value),
  () => step.value < 3 || rules.required(hasApprovedEULA.value),
  () =>
    step.value < 3 ||
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
    registerForm.value.reasons.length > 0
  );
});

onMounted(async () => {
  if (!oidc.loggedIn.value) return;

  const registrationStep = await registrationStore.checkAuthenticatedUser();
  if (
    registrationStep?.next === registrationSteps.FORM &&
    hasRegistrationFormData(registrationStep)
  ) {
    step.value = 2;
    emailChecked.value = true;
    accountStatus.value = registrationStep.accountStatus;

    const { user } = registrationStep;
    email.value = user?.email ?? "";
    firstName.value = user?.firstName ?? "";
    lastName.value = user?.lastName ?? "";
    nickname.value = user?.nickname ?? "";
    birthDay.value = user?.birthDate
      ? user.birthDate.toISOString().split("T")[0]
      : DEFAULT_BIRTHDAY;
    phoneNumber.value = user?.mobilePhone ?? "";
    teams.value = user?.teams ?? [];
    comment.value = user?.comment ?? "";
  }
});

const checkEmail = async () => {
  if (emailChecked.value || !email.value.trim()) return;
  const emailStep = await registrationStore.checkEmail(email.value);

  switch (emailStep?.next) {
    case registrationSteps.LOGIN:
      snackNotification.pushNotification(
        INFO,
        "Un compte avec cet email existe déjà. Redirection vers la page de connexion.",
      );
      setTimeout(() => oidc.login("zitadel"), 2 * ONE_SECOND_IN_MS);
      break;
    case registrationSteps.FORM:
      emailChecked.value = true;
      accountStatus.value = emailStep.accountStatus;
      break;
    default:
      break;
  }
};

const logout = async () => {
  if (oidc.loggedIn) myStore.clear();
  emailChecked.value = false;
  accountStatus.value = registrationAccountStatuses.EXISTING;
  password.value = "";
  repeatPassword.value = "";
};

const loading = ref<boolean>(false);
const register = async () => {
  loading.value = true;
  const res = await registrationStore.register(registerForm.value, token.value);
  if (!res) {
    loading.value = false;
    return;
  }

  planJauneAudioPlay();
  navigateTo(HOME_URL);
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

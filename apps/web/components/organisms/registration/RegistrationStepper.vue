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
          <v-form class="data personal-data">
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
            <v-btn
              text="Vous savez tout 🕵️"
              color="primary"
              @click="step = 3"
            />
            <v-btn text="Revenir" variant="text" @click="step = 1" />
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
              item-title="name"
              item-value="code"
              clearable
              hint="Tu nous rejoins à plusieurs ?"
              persistent-hint
              :rules="[twoTeamsMaximumRule]"
            />
          </v-form>
          <div class="stepper-actions">
            <v-btn text="On se capte 🤙" color="primary" @click="step = 4" />
            <v-btn text="Revenir" variant="text" @click="step = 2" />
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
            :variant="hasSignedVolunteerCharter ? 'flat' : 'outlined'"
            :color="hasSignedVolunteerCharter ? 'success' : 'primary'"
            :disabled="hasSignedVolunteerCharter"
            @click="openVolunteerCharterDialog"
          >
            {{ hasSignedVolunteerCharter
              ? "Charte signée ✔"
              : "Lire et signer la charte des bénévoles" }}
          </v-btn>

          <div class="stepper-actions">
            <v-btn
              text="M'inscrire"
              color="primary"
              :disabled="isFormInvalid"
              :loading="loading"
              @click="register"
            />
            <v-btn text="Revenir" variant="text" @click="step = 3" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>

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
      <VolunteerCharterDialogCard @close="closeVolunteerCharterDialog" @signed="signVolunteerCharter" />
    </v-dialog>
  </v-card>
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
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";
import { navigateTo } from "#app";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import { loginAndApplyForMembership } from "~/utils/login.utils";

const route = useRoute();
const registrationStore = useRegistrationStore();
const configurationStore = useConfigurationStore();
const teamStore = useTeamStore();

configurationStore.fetchAll();

const step = ref<number>(1);
const firstname = ref<string>("");
const lastname = ref<string>("");
const nickname = ref<string>("");
const birthday = ref<string>("2000-01-01");
const email = ref<string>("");
const phone = ref<string>("");
const comment = ref<string>("");
const teams = ref<RegistrationTeams>([]);
const password = ref<string>("");
const repeatPassword = ref<string>("");
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

const cleanComment = computed<string | undefined>(
  () => comment.value?.trim() || undefined,
);

const membership = computed<Membership>(() =>
  isVolunteerRegistration.value ? VOLUNTEER : STAFF,
);
const membershipLabel = computed<string>(() =>
  membership.value === STAFF ? "Organisateur" : "Bénévole",
);
const mustSignVolunteerCharter = computed(() =>
  shouldSignVolunteerCharter(membership.value),
);

const cleanNickname = computed<string | undefined>(
  () => nickname.value || undefined,
);

const registerForm = computed<RegisterForm>(() => {
  const form = commentAction(nicknameAction(RegisterForm.initFor(membership.value)))
    .fillBirthdate(birthdayDate.value)
    .fillEmail(email.value)
    .fillFirstname(firstname.value)
    .fillLastname(lastname.value)
    .fillMobilePhone(phone.value)
    .fillTeams(teams.value)
    .fillPassword(password.value);
  const withEULA = hasApprovedEULA.value
    ? form.approveEndUserLicenceAgreement()
    : form.denyEndUserLicenceAgreement();
  return hasSignedVolunteerCharter.value
    ? withEULA.signVolunteerCharter()
    : withEULA.denyVolunteerCharter();
});

const birthdayDate = computed<Date>(() => new Date(birthday.value));

type TeamForRegistration = { name: string; code: RegistrationTeamCode };
const comingFromTeams = computed<TeamForRegistration[]>(() => {
  return REGISTRATION_TEAM_CODES.map((code) => {
    const team = teamStore.getTeamByCode(code);
    return team ? { name: team.name, code: team.code } : undefined;
  }).filter((team): team is TeamForRegistration => team !== undefined);
});

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
  () => step.value <= 3 || rules.required(hasApprovedEULA.value),
  () => step.value <= 3 || !mustSignVolunteerCharter.value || rules.required(hasSignedVolunteerCharter.value)
]);

const repeatPasswordRule = computed(() => isSame(password.value));
const twoTeamsMaximumRule = computed(() => maxLength(2));

const isFormInvalid = computed<boolean>(() => {
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

const loading = ref<boolean>(false);
const register = async () => {
  loading.value = true;
  const res = await registrationStore.register(registerForm.value, token.value);
  if (!res) {
    loading.value = false;
    return;
  }

  const credentials = { email: email.value, password: password.value };
  await loginAndApplyForMembership(credentials, token.value);
  loading.value = false;
};

const isEULADialogOpen = ref<boolean>(false);
const openEULADialog = () => (isEULADialogOpen.value = true);
const closeEULADialog = () => (isEULADialogOpen.value = false);

const isVolunteerCharterDialogOpen = ref<boolean>(false);
const openVolunteerCharterDialog = () => (isVolunteerCharterDialogOpen.value = true);
const closeVolunteerCharterDialog = () => (isVolunteerCharterDialogOpen.value = false);
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
}

.data {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.eula-link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>

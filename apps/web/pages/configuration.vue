<template>
  <DesktopPageTitle />
  <v-img
    height="250"
    src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    alt="Un enfant qui utilise un panneau de contrôle"
    class="gif desktop-only"
  />

  <v-expansion-panels rounded="xl">
    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Description des formulaires d'inscription</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          <h3>Formulaire organisateur</h3>
          <RichEditor
            v-model="staffRegisterFormDescription"
            scope="staff-description"
          />
          <div class="description-actions">
            <v-btn
              text="Remplacer par le template"
              color="secondary"
              @click="replaceStaffRegisterDescriptionByTemplate"
            />
            <v-btn
              text="Enregistrer"
              color="primary"
              @click="saveStaffRegisterFormDescription"
            />
          </div>
          <v-divider class="my-5" />
          <div>
            <h3>Formulaire bénévole</h3>
            <RichEditor
              v-model="volunteerRegisterFormDescription"
              scope="volunteer-description"
            />
            <div class="description-actions">
              <v-btn
                text="Remplacer par le template"
                color="secondary"
                @click="replaceVolunteerRegisterDescriptionByTemplate"
              />
              <v-btn
                text="Enregistrer"
                color="primary"
                @click="saveVolunteerRegisterFormDescription"
              />
            </div>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Date de début de la manif</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="event-date">
          <DateField
            v-model="dateOrgaWeekStart"
            label="Début de la semaine orga"
            hide-details
          />
          <DateField
            v-model="dateEventStart"
            label="Début de la manif"
            hide-details
          />
        </div>
        <p v-if="isEventStartDateInvalid" class="error">
          La date de début de la semaine orga doit être avant la date de début
          de la manif.
        </p>
        <v-btn
          text="Enregistrer"
          color="primary"
          class="save-btn"
          :disabled="isEventStartDateInvalid"
          @click="saveEventStartDate"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Permissions</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <PermissionList />
        <CreatePermissionForm />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Equipes</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <TeamList />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Liens utiles</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="useful-links">
          <v-text-field
            v-model="usefulLinks.googleCalendar"
            label="Lien du calendrier Google"
            hide-details
          />
          <v-text-field
            v-model="usefulLinks.slack"
            label="Lien du groupe Slack"
            hide-details
          />
        </div>
        <v-btn
          text="Enregistrer"
          color="primary"
          class="save-btn"
          @click="saveUsefulLinks"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import {
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  VOLUNTEER_REGISTER_FORM_KEY,
  STAFF_REGISTER_FORM_KEY,
  USEFUL_LINKS_KEY,
} from "@overbookd/configuration";
import {
  defaultVolunteerCommitmentPresentation,
  defaultStaffCommitmentPresentation,
} from "@overbookd/registration";

useHead({ title: "Config admin" });

const configurationStore = useConfigurationStore();

onMounted(async () => {
  await configurationStore.fetchAll();
});

const dateEventStart = ref<Date>(configurationStore.eventStartDate);
const dateOrgaWeekStart = ref<Date>(
  configurationStore.orgaWeekStartDate ?? new Date(),
);
const usefulLinks = ref(configurationStore.usefulLinks);

const staffRegisterFormDescription = ref<string>(
  configurationStore.staffRegisterFormDescription,
);
const replaceStaffRegisterDescriptionByTemplate = () => {
  staffRegisterFormDescription.value = defaultStaffCommitmentPresentation;
};
const saveStaffRegisterFormDescription = async () => {
  await configurationStore.save({
    key: STAFF_REGISTER_FORM_KEY,
    value: { description: staffRegisterFormDescription.value },
  });
};

const volunteerRegisterFormDescription = ref<string>(
  configurationStore.volunteerRegisterFormDescription,
);
const replaceVolunteerRegisterDescriptionByTemplate = () => {
  volunteerRegisterFormDescription.value =
    defaultVolunteerCommitmentPresentation;
};
const saveVolunteerRegisterFormDescription = async () => {
  await configurationStore.save({
    key: VOLUNTEER_REGISTER_FORM_KEY,
    value: { description: volunteerRegisterFormDescription.value },
  });
};

const isEventStartDateInvalid = computed<boolean>(
  () => dateOrgaWeekStart.value >= dateEventStart.value,
);
const saveEventStartDate = async () => {
  if (isEventStartDateInvalid.value) return;

  await Promise.all([
    configurationStore.save({
      key: EVENT_DATE_KEY,
      value: { start: dateEventStart.value },
    }),
    configurationStore.save({
      key: ORGA_WEEK_DATE_KEY,
      value: { start: dateOrgaWeekStart.value },
    }),
  ]);
};

const saveUsefulLinks = async () => {
  await configurationStore.save({
    key: USEFUL_LINKS_KEY,
    value: usefulLinks.value,
  });
};
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 5px;
}

.gif {
  margin-bottom: 15px;
}

.collapse {
  margin-top: 5px;
}

.description-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}

.save-btn {
  margin-top: 12px;
}

.event-date,
.useful-links {
  display: flex;
  gap: 15px;
}

.useful-links {
  flex-direction: column;
}

.error {
  color: rgb(var(--v-theme-error));
  font-size: 12px;
  margin-top: 10px;
  margin-left: 15px;
}

.white-menu-item {
  background-color: white;
  color: black;

  &.is-active,
  &:hover {
    background-color: #d2d2d2;
  }
}
</style>

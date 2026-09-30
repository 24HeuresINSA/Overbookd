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
        <h2>Formulaire d'inscription</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          <h3>Inscription des bénévoles</h3>
          <p>
            L'inscription des bénévoles est actuellement
            <strong>
              {{ isVolunteerRegistrationOpen ? "ouverte" : "fermée" }} </strong
            >.
          </p>
          <v-btn
            :model-value="isVolunteerRegistrationOpen"
            :text="`${volunteerRegistrationStatusKeyword} l'inscription des bénévoles`"
            :color="isVolunteerRegistrationOpen ? 'error' : 'success'"
            class="mt-1"
            @click="openVolunteerRegistrationStatusDialog"
          />
        </div>
        <v-divider class="my-5" />
        <div>
          <h3>Description organisateur·rice</h3>
          <RichEditor
            v-model="staffRegistrationFormDescription"
            scope="staff-description"
          />
          <div class="description-actions">
            <v-btn
              text="Remplacer par le template"
              color="secondary"
              @click="replaceStaffRegistrationDescriptionByTemplate"
            />
            <v-btn
              text="Enregistrer"
              color="primary"
              @click="saveRegistrationFormConfig"
            />
          </div>
          <v-divider class="my-5" />
          <div>
            <h3>Description bénévole</h3>
            <RichEditor
              v-model="volunteerRegistrationFormDescription"
              scope="volunteer-description"
            />
            <div class="description-actions">
              <v-btn
                text="Remplacer par le template"
                color="secondary"
                @click="replaceVolunteerRegistrationDescriptionByTemplate"
              />
              <v-btn
                text="Enregistrer"
                color="primary"
                @click="saveRegistrationFormConfig"
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
            label="Lundi de la semaine orga"
            hide-details
          />
          <DateField
            v-model="dateEventStart"
            label="Vendredi de la manif"
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

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Stats des FA & FT de l'édition précédente</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="festival-event-stats">
          <div class="festival-event-stats__list">
            <h3>Stats des FA</h3>
            <FestivalEventStatList
              :stats="lastEditionFestivalEventStats.activities"
              festival-event="FA"
              @remove="removeFestivalActivityStat"
            />
            <CreateFestivalEventStatForm
              festival-event="FA"
              @create="upsertFestivalActivityStat"
            />
          </div>
          <v-divider class="mx-5" :vertical="isDesktop" />
          <div class="festival-event-stats__list">
            <h3>Stats des FT</h3>
            <FestivalEventStatList
              :stats="lastEditionFestivalEventStats.tasks"
              festival-event="FT"
              @remove="removeFestivalTaskStat"
            />
            <CreateFestivalEventStatForm
              festival-event="FT"
              @create="upsertFestivalTaskStat"
            />
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog v-model="isVolunteerRegistrationstatusDialogOpen" max-width="600px">
    <ConfirmationDialogCard
      :confirm-color="isVolunteerRegistrationOpen ? 'error' : 'success'"
      @close="closeVolunteerRegistrationStatusDialog"
      @confirm="switchVolunteerRegistrationStatus"
    >
      <template #title>
        {{ volunteerRegistrationStatusKeyword }} l'inscription des bénévoles
      </template>
      <template #statement>
        Êtes-vous sûr de vouloir
        <strong> {{ volunteerRegistrationStatusKeyword.toUpperCase() }}</strong>
        l'inscription des bénévoles ?
        <br />
        <i>
          Cela n'impactera pas l'inscription des organisateurs via le lien
          d'invitation.
        </i>
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  REGISTRATION_FORM_KEY,
  USEFUL_LINKS_KEY,
  LAST_EDITION_FESTIVAL_EVENT_STATS_KEY,
  type RegistrationFormConfigValue,
  type UsefulLinksConfigValue,
  type FestivalEventStatsConfigValue,
  type FestivalEventStatConfigValue,
} from "@overbookd/configuration";
import { updateItemToList } from "@overbookd/list";
import {
  defaultVolunteerCommitmentPresentation,
  defaultStaffCommitmentPresentation,
} from "@overbookd/registration";

useHead({ title: "Config admin" });

const configurationStore = useConfigurationStore();
await configurationStore.fetchAll();

const layoutStore = useLayoutStore();
const isDesktop = computed<boolean>(() => !layoutStore.isMobile);

const isVolunteerRegistrationOpen = ref<boolean>(
  configurationStore.registrationForm.isVolunteerRegistrationOpen,
);
const isVolunteerRegistrationstatusDialogOpen = ref<boolean>(false);
const volunteerRegistrationStatusKeyword = computed<string>(() =>
  isVolunteerRegistrationOpen.value ? "Fermer" : "Ouvrir",
);
const openVolunteerRegistrationStatusDialog = () => {
  isVolunteerRegistrationstatusDialogOpen.value = true;
};
const closeVolunteerRegistrationStatusDialog = () => {
  isVolunteerRegistrationstatusDialogOpen.value = false;
};
const switchVolunteerRegistrationStatus = () => {
  isVolunteerRegistrationOpen.value = !isVolunteerRegistrationOpen.value;
  saveRegistrationFormConfig();
  closeVolunteerRegistrationStatusDialog();
};

const staffRegistrationFormDescription = ref<string>(
  configurationStore.registrationForm.staffDescription,
);
const volunteerRegistrationFormDescription = ref<string>(
  configurationStore.registrationForm.volunteerDescription,
);
const replaceStaffRegistrationDescriptionByTemplate = () => {
  staffRegistrationFormDescription.value = defaultStaffCommitmentPresentation;
};
const replaceVolunteerRegistrationDescriptionByTemplate = () => {
  volunteerRegistrationFormDescription.value =
    defaultVolunteerCommitmentPresentation;
};
const saveRegistrationFormConfig = async () => {
  const configValue: RegistrationFormConfigValue = {
    isVolunteerRegistrationOpen: isVolunteerRegistrationOpen.value,
    staffDescription: staffRegistrationFormDescription.value,
    volunteerDescription: volunteerRegistrationFormDescription.value,
  };
  await configurationStore.save({
    key: REGISTRATION_FORM_KEY,
    value: configValue,
  });
};

const dateEventStart = ref<Date>(configurationStore.eventStartDate);
const dateOrgaWeekStart = ref<Date>(
  configurationStore.orgaWeekStartDate ?? new Date(),
);
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

const usefulLinks = ref<UsefulLinksConfigValue>(configurationStore.usefulLinks);
const saveUsefulLinks = async () => {
  await configurationStore.save({
    key: USEFUL_LINKS_KEY,
    value: usefulLinks.value,
  });
};

const lastEditionFestivalEventStats = ref<FestivalEventStatsConfigValue>(
  configurationStore.lastEditionFestivalEventStats,
);
const saveLastEditionFestivalEventStats = async () => {
  await configurationStore.save({
    key: LAST_EDITION_FESTIVAL_EVENT_STATS_KEY,
    value: lastEditionFestivalEventStats.value,
  });
};
const upsertFestivalActivityStat = async (
  stat: FestivalEventStatConfigValue,
) => {
  const existing = lastEditionFestivalEventStats.value.activities.findIndex(
    (s) => s.code === stat.code,
  );
  if (existing === -1) {
    lastEditionFestivalEventStats.value.activities.push(stat);
  } else {
    lastEditionFestivalEventStats.value.activities = updateItemToList(
      lastEditionFestivalEventStats.value.activities,
      existing,
      stat,
    );
  }
  await saveLastEditionFestivalEventStats();
};
const upsertFestivalTaskStat = async (stat: FestivalEventStatConfigValue) => {
  const existing = lastEditionFestivalEventStats.value.tasks.findIndex(
    (s) => s.code === stat.code,
  );
  if (existing === -1) {
    lastEditionFestivalEventStats.value.tasks.push(stat);
  } else {
    lastEditionFestivalEventStats.value.tasks = updateItemToList(
      lastEditionFestivalEventStats.value.tasks,
      existing,
      stat,
    );
  }
  await saveLastEditionFestivalEventStats();
};
const removeFestivalActivityStat = async (
  stat: FestivalEventStatConfigValue,
) => {
  lastEditionFestivalEventStats.value.activities =
    lastEditionFestivalEventStats.value.activities.filter(
      (s) => s.code !== stat.code,
    );
  await saveLastEditionFestivalEventStats();
};
const removeFestivalTaskStat = async (stat: FestivalEventStatConfigValue) => {
  lastEditionFestivalEventStats.value.tasks =
    lastEditionFestivalEventStats.value.tasks.filter(
      (s) => s.code !== stat.code,
    );
  await saveLastEditionFestivalEventStats();
};
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 8px;
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
.useful-links,
.festival-event-stats {
  display: flex;
  gap: 15px;
}

.useful-links {
  flex-direction: column;
}

.festival-event-stats {
  width: 100%;
  &__list {
    flex: 1;
    min-width: 0;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
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

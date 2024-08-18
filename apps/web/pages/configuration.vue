<template>
  <DesktopPageTitle />
  <v-img
    height="400"
    src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    class="gif"
  />

  <v-expansion-panels rounded="xl">
    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Description du formulaire d'inscription</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <TipTap v-model="registerFormDescription" />
        <div class="description-actions">
          <v-btn
            text="Remplacer par le template"
            color="secondary"
            variant="text"
            @click="replaceRegisterDescriptionByTemplate"
          />
          <v-btn
            text="Enregistrer"
            color="primary"
            @click="saveRegisterFormDescription"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Date de début de la manif</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <DateField
          v-model="dateEventStart"
          label="Début de la manif"
          hide-details
        />
        <v-btn
          text="Enregistrer"
          color="primary"
          class="save-btn"
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
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { defaultCommitmentPresentation } from "@overbookd/registration";

useHead({ title: "Config admin" });

const configurationStore = useConfigurationStore();

onMounted(async () => {
  await configurationStore.fetchAll();
});

const dateEventStart = ref<Date>(configurationStore.eventStartDate);
const registerFormDescription = ref<string>(
  configurationStore.registerFormDescription,
);

const replaceRegisterDescriptionByTemplate = () => {
  registerFormDescription.value = defaultCommitmentPresentation;
};
const saveRegisterFormDescription = async () => {
  await configurationStore.save({
    key: "registerForm",
    value: { description: registerFormDescription.value },
  });
};
const saveEventStartDate = async () => {
  await configurationStore.save({
    key: "eventDate",
    value: { start: dateEventStart.value },
  });
};
</script>

<style lang="scss" scoped>
.gif {
  margin-bottom: 15px;
  @media screen and (max-width: 600px) {
    display: none;
  }
}

.collapse {
  margin-top: 5px;
}

.description-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
}

.save-btn {
  margin-top: 12px;
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

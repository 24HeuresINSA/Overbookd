<template>
  <h1>Configuration du système ⚙️</h1>
  <v-img
    height="400"
    src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
  />

  <v-expansion-panels>
    <v-expansion-panel class="collapse">
      <v-expansion-panel-title>
        <h2>Description du formulaire d'inscription</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <TipTap v-model="registerFormDescription" />
        <div class="description-actions">
          <v-btn
            color="secondary"
            variant="text"
            @click="replaceRegisterDescriptionByTemplate"
          >
            Remplacer par le template
          </v-btn>
          <v-btn color="primary" @click="saveRegisterFormDescription">
            Enregistrer
          </v-btn>
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
        <v-btn color="primary" class="save-btn" @click="saveEventStartDate">
          Enregistrer
        </v-btn>
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
await configurationStore.fetchAll();

const dateEventStart = ref(configurationStore.eventStartDate);
const registerFormDescription = ref(configurationStore.registerFormDescription);

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
.collapse {
  margin-top: 20px;
}

.description-actions {
  display: flex;
  gap: 1rem;
  margin-top: 12px;
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

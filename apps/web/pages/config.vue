<template>
  <v-container>
    <h1>Configuration du système ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <v-expansion-panels>
      <v-expansion-panel class="collapse">
        <v-expansion-panel-header>
          <h2>Description du formulaire d'inscription</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <RichEditor
            :data="registerFormDescription"
            @update:data="updateRegisterFormDescription($event)"
          >
            <template #header>
              <div class="divider" />
              <TiptapMenuItem
                title="Texte par défaut"
                class="white-menu-item"
                :action="replaceRegisterDescriptionByTemplate"
              />
            </template>
          </RichEditor>

          <v-btn
            color="primary"
            class="save-btn"
            @click="saveRegisterFormDescription"
          >
            Enregistrer
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel class="collapse">
        <v-expansion-panel-header>
          <h2>Date de début de la manif</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DateField
            v-model="dateEventStart"
            label="Début de la manif"
          ></DateField>
          <v-btn color="primary" class="save-btn" @click="saveEventStartDate">
            Enregistrer
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel class="collapse">
        <v-expansion-panel-header>
          <h2>Permissions</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <PermissionsCard />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel class="collapse">
        <v-expansion-panel-header>
          <h2>Equipes</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <TeamsCard />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <SnackNotificationContainer />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PermissionsCard from "~/components/organisms/permission/PermissionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import DateField from "~/components/atoms/field/date/DateField.vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import TiptapMenuItem from "~/components/atoms/field/tiptap/TiptapMenuItem.vue";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import TeamsCard from "~/components/organisms/team/TeamsCard.vue";

type ConfigurationData = {
  dateEventStart: Date;
  registerFormDescription: string;
};

export default Vue.extend({
  name: "Config",
  components: {
    PermissionsCard,
    SnackNotificationContainer,
    DateField,
    RichEditor,
    TiptapMenuItem,
    TeamsCard,
  },

  data(): ConfigurationData {
    return {
      dateEventStart: new Date(),
      registerFormDescription: "",
    };
  },

  head: () => ({
    title: "Config Système",
  }),

  async created() {
    await this.$accessor.configuration.fetchAll();
    this.dateEventStart = this.$accessor.configuration.eventStartDate;
    this.registerFormDescription =
      this.$accessor.configuration.registerFormDescription;
  },

  methods: {
    replaceRegisterDescriptionByTemplate() {
      this.registerFormDescription = defaultCommitmentPresentation;
    },
    updateRegisterFormDescription(description: string) {
      this.registerFormDescription = description;
    },
    saveRegisterFormDescription() {
      this.$accessor.configuration.save({
        key: "registerForm",
        value: { description: this.registerFormDescription },
      });
    },
    saveEventStartDate() {
      this.$accessor.configuration.save({
        key: "eventDate",
        value: { start: this.dateEventStart },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.collapse {
  margin-top: 20px;
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

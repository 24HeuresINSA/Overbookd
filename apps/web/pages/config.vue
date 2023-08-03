<template>
  <v-container>
    <h1>Configuration du système ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <h2>Description du formulaire d'inscription</h2>
    <RichEditor
      :data="registerFormDescription"
      @change="updateRegisterFormDescription($event)"
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

    <h2>Date de début de la manif</h2>
    <DateField v-model="dateEventStart" label="Début de la manif"></DateField>
    <v-btn class="save-btn" @click="save"> Enregistrer </v-btn>

    <PermissionsCard />
    <SnackNotificationContainer />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PermissionsCard from "~/components/organisms/permission/PermissionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import DateField from "~/components/atoms/field/date/DateField.vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import { isSameDay } from "~/utils/date/dateUtils";
import TiptapMenuItem from "~/components/atoms/field/tiptap/TiptapMenuItem.vue";

interface ConfigurationData {
  dateEventStart: Date;
  registerFormDescription: string;
}

export default Vue.extend({
  name: "Config",
  components: {
    PermissionsCard,
    SnackNotificationContainer,
    DateField,
    RichEditor,
    TiptapMenuItem,
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
      this.registerFormDescription = `<p>Hello et merci d'être venu jusqu'ici ! 🤗</p>
        <p>
          Le festival des 24 heures de l'INSA n'est possible que grâce aux
          plus de
          <strong>350 bénévoles</strong> qui, comme toi, ont accepté de venir
          nous donner un coup de main pour préparer, organiser et faire en
          sorte que les festivaliers passent le meilleur moment possible. 🎉
        </p>
        <p>
          Pour que l'on puisse t'accueillir dans les meilleures conditions il
          nous faut cependant quelques informations sur toi et le temps que tu
          souhaites consacrer à nous aider.
        </p>
        <p>
          Si tu as la moindre question sur le festival et ce que tu peux faire
          pour nous aider, n'hésite pas a contacter les
          <a href="mailto:humains@24heures.org">responsables bénévoles</a>.
          <br />
          Ils seront tes principaux interlocuteurs en amont et en aval du
          festival. 😎
        </p>`;
    },
    updateRegisterFormDescription(description: string) {
      this.registerFormDescription = description;
    },
    async save() {
      const configurationsToSave = [];

      const dateEventStartChanged = !isSameDay(
        this.dateEventStart,
        this.$accessor.configuration.eventStartDate
      );

      if (dateEventStartChanged) {
        configurationsToSave.push({
          key: "eventDate",
          value: { start: this.dateEventStart },
        });
      }

      const registerFormDescriptionChanged =
        this.registerFormDescription !==
        this.$accessor.configuration.registerFormDescription;

      if (registerFormDescriptionChanged) {
        configurationsToSave.push({
          key: "registerForm",
          value: { description: this.registerFormDescription },
        });
      }

      await Promise.all(
        configurationsToSave.map((config) =>
          this.$accessor.configuration.save(config)
        )
      );
    },
  },
});
</script>

<style lang="scss" scoped>
h2 {
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

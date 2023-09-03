<template>
  <v-card>
    <v-card-title>
      <v-icon>mdi-account</v-icon>
      <span class="ml-2">{{ formLabel }} une équipe</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="name"
          label="Nom"
          :rules="[rules.required]"
          required
        />
        <label for="color-picker">Couleur</label>
        <v-color-picker
          id="color-picker"
          v-model="color"
          :rules="[rules.required]"
          hide-inputs
          required
        />
        <v-text-field
          v-model="icon"
          label="Icône"
          prefix="mdi-"
          :rules="[rules.required]"
          required
        />
      </v-form>

      <div class="render">
        <h3>Aperçu</h3>
        <v-chip :small="true" :color="color">
          <v-icon :small="true" color="white"> mdi-{{ icon }} </v-icon>
          <span class="name">{{ name ?? "" }}</span>
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="closeDialog"> Annuler </v-btn>
      <v-btn
        color="primary"
        :disabled="!isValidForm"
        @click="createOrUpdateTeam"
      >
        {{ formLabel }} l'équipe
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { InputRulesData, required } from "~/utils/rules/input.rules";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "~/utils/models/team.model";

interface TeamFormData extends InputRulesData {
  name?: string;
  color?: string;
  icon?: string;
}

export default Vue.extend({
  name: "TeamForm",
  props: {
    team: {
      type: Object,
      default: () => null,
    },
  },
  data: (): TeamFormData => ({
    name: undefined,
    color: "#000000",
    icon: undefined,
    rules: { required },
  }),
  computed: {
    isValidForm(): boolean {
      return Boolean(this.name && this.color && this.icon);
    },
    isCreateForm(): boolean {
      return !this.team;
    },
    formLabel(): string {
      return this.isCreateForm ? "Créer" : "Modifier";
    },
  },
  watch: {
    team(team: Team) {
      this.name = team?.name;
      this.color = team?.color ?? "#000000";
      this.icon = team?.icon.replace("mdi-", "");
    },
  },
  mounted() {
    if (!this.team) return;
    this.name = this.team.name;
    this.color = this.team.color;
    this.icon = this.team.icon.replace("mdi-", "");
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    createOrUpdateTeam() {
      if (this.isCreateForm) return this.createTeam();
      return this.updateTeam();
    },
    createTeam() {
      const newTeam = {
        name: this.name,
        code: SlugifyService.applyOnOptional(this.name),
        color: this.color,
        icon: `mdi-${this.icon}`,
      };
      this.$emit("create", newTeam);
      this.closeDialog();
    },
    updateTeam() {
      const updatedTeam = {
        ...this.team,
        name: this.name,
        color: this.color,
        icon: `mdi-${this.icon}`,
      };
      this.$emit("update", updatedTeam);
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
span.name {
  color: white;
  margin-left: 4px;
}

.render {
  display: flex;
  gap: 10px;
}
</style>

<template>
  <v-container style="padding: 0">
    <v-chip-group :show-arrows="false">
      <v-chip v-for="(role, i) in mRoles" :key="i" small :color="role.color">
        <v-icon small left color="white">
          {{ role.icon }}
        </v-icon>
        <a style="color: white">{{ role.name }}</a>
      </v-chip>
    </v-chip-group>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "OverChipsLight",
  props: {
    roles: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  },

  computed: {
    mRoles() {
      return this.$accessor.config.getConfigTeams(this.roles);
    },
  },
});
</script>

<style scoped></style>

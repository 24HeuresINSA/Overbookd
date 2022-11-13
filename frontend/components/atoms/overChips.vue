<template>
  <v-container style="padding: 0">
    <v-chip-group>
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
  name: "OverChips",
  props: {
    roles: {
      type: Array as PropType<number[]>,
      required: false,
      default: () => [],
    },
  },

  computed: {
    mRoles() {
      return this.$accessor.team.getTeams(this.roles);
    },
  },
});
</script>

<style scoped></style>

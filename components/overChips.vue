<template>
  <v-container style="padding: 0">
    <v-chip-group>
      <v-chip v-for="(role, i) in mRoles" v-bind:key="i" :color="role.color">
        <v-icon left color="white">
          {{ role.icon }}
        </v-icon>
        <a style="color: white">{{ role.name }}</a>
      </v-chip>
    </v-chip-group>
  </v-container>
</template>

<script>
import { getConfig } from "../common/role";

export default {
  name: "overChips",
  props: ["roles"],

  computed: {
    mRoles() {
      if (this.roles) {
        return getConfig(this, "teams").filter((team) =>
            this.roles.includes(team.name)
        );
      }

    },
  },
};
</script>

<style scoped></style>

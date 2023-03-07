<template>
  <v-container style="padding: 0">
    <v-chip-group>
      <v-chip
        v-for="(role, i) in mRoles"
        :key="i"
        small
        :color="role.color"
        :class="getFlipClass(role)"
      >
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
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "OverChips",
  props: {
    roles: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  },
  computed: {
    mRoles(): Team[] {
      return this.$accessor.team.getTeams(this.roles);
    },
  },
  methods: {
    getFlipClass(role: Team): string {
      return role.code === "bde" ? "flip" : "";
    },
  },
});
</script>

<style lang="scss" scoped>
.flip {
  transform: rotate(180deg);
}
</style>

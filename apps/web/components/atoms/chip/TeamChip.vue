<template>
  <v-chip
    :small="small"
    :large="large"
    :color="color"
    :class="flipClass"
    @click="sendEvent"
  >
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-if="teamMetadate"
          :small="small"
          :large="large"
          v-bind="attrs"
          color="white"
          v-on="on"
        >
          {{ teamMetadate.icon }}
        </v-icon>
        <span v-if="withName" class="name">
          {{ teamMetadate.name }}
        </span>
      </template>
      <span>{{ teamMetadate?.name ?? "" }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue';
import { Team } from '~/utils/models/team';

export default Vue.extend({
  name: 'TeamChip',
  props: {
    team: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    withName: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    small(): boolean {
      return this.size === 'small';
    },
    large(): boolean {
      return this.size === 'large';
    },
    teamMetadate(): Team {
      return this.$accessor.team.getTeams([this.team])?.[0];
    },
    color(): string {
      return this.teamMetadate?.color ?? 'grey';
    },
    flipClass(): string {
      return this.team === 'bde' ? 'flip' : '';
    },
  },
  methods: {
    sendEvent() {
      this.$emit('click', this.team);
    },
  },
});
</script>

<style lang="scss" scoped>
.v-chip {
  margin-right: 2px;
}
span.name {
  color: white;
  margin-left: 4px;
}
.flip {
  transform: rotate(180deg);
}
</style>

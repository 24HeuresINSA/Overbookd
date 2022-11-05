<template>
  <div class="card" @contextmenu.prevent="calendar">
    {{ user.firstname }} {{ user.lastname }} | {{ user.charisma }}
    <v-icon
      v-if="user.availableFriend && user.availableFriend.size > 0"
      small
      class="icon pr-8"
      @click.stop="toggleFriendDialog"
    >
      mdi-account-group
    </v-icon>
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          right
          small
          v-bind="attrs"
          class="icon"
          v-on="on"
          @click.stop="askForUserDetails"
        >
          mdi-information
        </v-icon>
      </template>
      <span>{{ user.comment }}</span>
    </v-tooltip>
    <br />
    <MiniUserBadge v-for="team of getCleanTeam" :key="team" :team="team" />
    <FriendInformation
      :user="user"
      :toggle="isFriendDialogOpen"
      @update-toggle="(t) => (isFriendDialogOpen = t)"
      @assign-user="(friend) => $emit('assign-user', friend)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { User } from "~/utils/models/repo";
import MiniUserBadge from "~/components/atoms/MiniUserBadge.vue";
import FriendInformation from "~/components/organisms/FriendInformation.vue";

export default Vue.extend({
  name: "UserResume",
  components: { MiniUserBadge, FriendInformation },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      isUserDialogOpen: false,
      isFriendDialogOpen: false,
    };
  },
  computed: {
    getCleanTeam(): any {
      return this.user.team.filter(
        (team) => team !== "toValidate" && team !== "admin" && team !== "orga"
      );
    },
  },
  methods: {
    getTeamMetadate(team: string): any {
      return this.$accessor.team.getTeams([team])?.[0];
    },
    askForUserDetails(): void {
      this.$emit("click:user-details", this.user);
    },
    getClass(team: string): string {
      switch (team) {
        case "hard":
          return "hard";
        case "soft":
          return "soft";
        case "confiance":
          return "confiance";
        default:
          return "normal";
      }
    },
    toggleUserDialog(): any {
      this.isUserDialogOpen = !this.isUserDialogOpen;
    },
    toggleFriendDialog(): any {
      this.isFriendDialogOpen = !this.isFriendDialogOpen;
    },
    calendar(): any {
      window.open(`/calendar/${this.user.id}`, "_blank");
    },
  },
});
</script>

<style scoped>
.card {
  height: 60px;
  width: 300px;
  overflow: hidden;
  position: relative !important;
}

.role {
  display: inline-block;
  text-align: center;
  border-radius: 10%;
  margin-right: 6px;
  font-weight: bold;
  color: white;
}

.card .hard {
  background-color: rgb(250, 65, 65);
  box-shadow: rgb(0, 0, 0);
}

.card .soft {
  background-color: rgb(130, 65, 250);
  box-shadow: rgb(0, 0, 0);
}

.card .confiance {
  background-color: rgb(22, 141, 1);
  box-shadow: rgb(0, 0, 0);
}

.card .normal {
  background-color: rgb(5, 91, 98);
  box-shadow: rgb(0, 0, 0);
}

.icon {
  position: absolute !important;
  top: 0px;
  right: 0px;
}
</style>

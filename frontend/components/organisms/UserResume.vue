<template>
  <div class="card">
    {{ user.firstname }} {{ user.lastname }} | {{ user.charisma }}
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          right
          small
          v-bind="attrs"
          class="icon"
          v-on="on"
          @click.stop="toggleUserDialog"
        >
          mdi-information
        </v-icon>
      </template>
      <span>{{ user.comment }}</span>
    </v-tooltip>
    <br />
    <v-chip
      v-for="team of getCleanTeam"
      :key="team"
      small
      :color="getTeamMetadate(team) ? getTeamMetadate(team).color : 'grey'"
    >
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon v-if="getTeamMetadate(team)" small v-bind="attrs" v-on="on">
            {{ getTeamMetadate(team).icon }}
          </v-icon>
        </template>
        <span>{{
          getTeamMetadate(team) ? getTeamMetadate(team).name : ""
        }}</span>
      </v-tooltip>
    </v-chip>
    <UserInformation
      :user="user"
      :toggle="isUserDialogOpen"
      @update-toggle="(t) => (isUserDialogOpen = t)"
    ></UserInformation>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { User } from "~/utils/models/repo";
import UserInformation from "~/components/organisms/userInformation.vue";

export default Vue.extend({
  name: "UserResume",
  components: { UserInformation },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      isUserDialogOpen: false,
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
      const teamsConfig = this.$accessor.config.getConfig("teams");
      return teamsConfig.find((item: { name: string }) => item.name === team);
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

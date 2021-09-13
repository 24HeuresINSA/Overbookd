<template>
  <v-container
    style="
      left: 0;
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      position: absolute;
      display: flex;
    "
  >
    <div style="display: flex; flex-flow: column">
      <!-- list of  filtered users -->
      <v-card>
        <v-card-title>User</v-card-title>
        <v-card-text>
          <h3>Filtres</h3>
          <v-text-field
            prepend-icon="mdi-card-search"
            v-model="filters.name"
          ></v-text-field>
          <v-combobox
            chips
            multiple
            clearable
            label="team"
            :items="getConfig('teams').map((e) => e.name)"
            v-model="filters.teams"
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                :color="getRoleMetadata(item).color"
              >
                <v-icon left color="white">
                  {{ getRoleMetadata(item).icon }}
                </v-icon>
                <a style="color: white">{{ getRoleMetadata(item).name }}</a>
              </v-chip>
            </template>
          </v-combobox>
          <v-divider></v-divider>
          <v-list>
            <v-list-item-group v-model="selectedUserIndex">
              <v-list-item v-for="user of filteredUsers" v-bind:key="user._id">
                <v-list-item-content>
                  <h4>
                    {{ user.firstname }} {{ user.lastname.toUpperCase() }}
                    {{ user.nickname ? `(${user.nickname})` : "" }}
                  </h4>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- list of selected user's friend -->
      <v-card v-if="getSelectedUser && getSelectedUser.friends">
        <v-list>
          <v-subheader>les amis du user selectionné</v-subheader>
          <v-list-item-group v-model="selectedUserFriend">
            <v-list-item
              v-for="friend of getSelectedUser.friends"
              v-bind:key="friend.keycloakID"
            >
              <v-list-item-content>
                <h4>{{ friend.username ? friend.username : friend }}</h4>
                <!--          <v-chip>{{user.charisma}}</v-chip>-->
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
    <!-- calendar --->
    <v-calendar
      style="flex-grow: 2; max-height: 100%"
      ref="calendar"
      :value="selectedDay"
      :events="selectedUserAvailabilities"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>

    <div style="display: flex; flex-flow: column">
      <v-btn icon @click="isInfoDisplayed = true"> </v-btn>

      <v-card v-if="getSelectedUser">
        <v-img
          v-if="getSelectedUser.pp"
          :src="getPPUrl() + 'api/user/pp/' + getSelectedUser.pp"
          max-height="200px"
        ></v-img>
        <v-card-title
          >{{ getSelectedUser.firstname }}.{{
            getSelectedUser.lastname
          }}</v-card-title
        >
        <v-card-text v-if="isInfoDisplayed">
          <v-list>
            <v-list-item-group v-model="isInfoDisplayed">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Charisme</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ getSelectedUser.charisma }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Date de naissance</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ new Date(getSelectedUser.birthdate).toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-progress-linear
            :value="getSelectedUser.charisma / getConfig('max_charisma')"
          ></v-progress-linear>
        </v-card-text>
      </v-card>

      <v-date-picker v-model="selectedDay"></v-date-picker>

      <!-- list of users -->
      <v-card>
        <v-list>
          <v-subheader>FT</v-subheader>
          <v-list-item-group v-model="selectedAssignmentsIndex" multiple>
            <v-list-item
              v-for="schedule in filteredSchedules"
              v-bind:key="schedule._id"
            >
              <v-list-item-content>
                {{ schedule.name }} {{ schedule.schedule.date }}
                {{ schedule.schedule.start }} ➡️{{ schedule.schedule.end }}
              </v-list-item-content>
              <v-list-item-icon
                ><v-icon> mdi-information </v-icon></v-list-item-icon
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>

    <v-btn
      fab
      v-if="getSelectedUser"
      @click="saveAssignment"
      style="position: fixed; right: 20px; bottom: 40px; z-index: 20"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>

    <v-snackbar v-model="isFeedbackSnackbarOpen" :timeout="5000"
      >aller au suivant 🥳</v-snackbar
    >
  </v-container>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";

export default {
  name: "assignment",

  data() {
    return {
      users: [],
      filteredUsers: [],
      selectedUserIndex: undefined,
      selectedAssignmentsIndex: undefined,
      selectedUserFriend: undefined,
      selectedDay: undefined,
      FTs: [],
      updatedFTs: [],
      isFeedbackSnackbarOpen: false,
      isInfoDisplayed: false,
      filters: {
        name: undefined,
        teams: [],
      },
      teams: this.getConfig("teams"),
    };
  },

  async mounted() {
    if (!hasRole(this, "hard")) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }

    // user has access to this page
    // get user list
    this.users = (await this.$axios.get("/user")).data;
    this.filteredUsers = this.users;

    // get FTs
    this.FTs = (await this.$axios.get("/FT")).data.data; // idk but it works
  },

  methods: {
    getStupidAmericanTimeFormat(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    getConfig(key) {
      return getConfig(this, key);
    },

    getCalendarFormattedAssignedFTsOfSelectedUser() {
      let events = [];
      if (this.getSelectedUser && this.getSelectedUser.assigned !== undefined) {
        let assignedFTs = this.getSelectedUser.assigned;
        assignedFTs.forEach((assignedFT) => {
          let start = new Date(
            Date.parse(
              assignedFT.schedule.date + " " + assignedFT.schedule.start
            )
          );
          let end = new Date(
            Date.parse(assignedFT.schedule.date + " " + assignedFT.schedule.end)
          );
          events.push({
            name: assignedFT.name,
            start: this.getStupidAmericanTimeFormat(start),
            end: this.getStupidAmericanTimeFormat(end),
            color: "#ebc034",
          });
        });
      }
      return events;
    },

    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    async saveAssignment() {
      // save FT
      // console.log(this.updatedFTs);
      await this.$axios.put(`/user/${this.getSelectedUser.keycloakID}`, {
        assigned: this.getSelectedUser.assigned,
      });
      this.isFeedbackSnackbarOpen = true;
    },
  },

  computed: {
    getSelectedUser() {
      return this.users[this.selectedUserIndex];
    },

    selectedAssignments() {
      if (this.selectedAssignmentsIndex) {
        return this.selectedAssignmentsIndex.map(
          (i) => this.filteredSchedules[i]
        );
      }
    },

    filteredSchedules() {
      // FTs that are in the selected users availability
      let filteredSchedules = [];
      let userAvailabilities = [];
      if (this.getSelectedUser && this.getSelectedUser.availabilities) {
        this.getSelectedUser.availabilities.forEach((availability) => {
          if (availability.days) {
            availability.days.forEach((day) => {
              day.frames.forEach((frame) => {
                userAvailabilities.push({
                  start: new Date(Date.parse(day.date + " " + frame.start)),
                  end: new Date(Date.parse(day.date + " " + frame.end)),
                });
              });
            });
          }
        });
        userAvailabilities.forEach((timeframe) => {
          this.FTs.forEach((FT) => {
            if (FT.schedules) {
              FT.schedules.forEach((schedule) => {
                let start = Date.parse(schedule.date + " " + schedule.start);
                let end = Date.parse(schedule.date + " " + schedule.start);
                if (timeframe.start <= start && timeframe.end >= end) {
                  filteredSchedules.push({
                    name: FT.name,
                    FTID: FT._id,
                    schedule,
                  });
                }
              });
            }
          });
        });
      }
      return filteredSchedules;
    },

    selectedUserAvailabilities() {
      let events = [];
      if (this.getSelectedUser && this.getSelectedUser.availabilities) {
        let mAvailabilities = this.getSelectedUser.availabilities;
        if (mAvailabilities.length !== 0) {
          mAvailabilities.forEach((reason) => {
            if (reason.days) {
              reason.days.forEach((day) => {
                if (day.frames) {
                  day.frames.forEach((frame) => {
                    let timeframe = {
                      start: new Date(Date.parse(day.date + " " + frame.start)),
                      end: new Date(Date.parse(day.date + " " + frame.end)),
                    };
                    events.push({
                      name: "Disponible",
                      start: this.getStupidAmericanTimeFormat(timeframe.start),
                      end: this.getStupidAmericanTimeFormat(timeframe.end),
                    });
                  });
                }
              });
            }
          });
        }
      }
      // add assigned events
      const assignedEvents =
        this.getCalendarFormattedAssignedFTsOfSelectedUser();
      events = events.concat(assignedEvents);
      return events;
    },
  },

  watch: {
    selectedAssignments() {
      // selected assignment changed...
      let user = this.getSelectedUser;
      this.$set(user, "assigned", this.selectedAssignments);

      console.log("sat, ", this.selectedAssignments);
      console.log("user.assigned", user.assigned);

      // save in FT
      // user.assigned.forEach(assignment => {
      //   // get FT
      //   let FT = this.FTs.find(FT => FT._id === assignment.FTID);
      //   let schedule = FT.schedules.find(({date, start, end}) => {
      //     const mSchedule = assignment.schedule;
      //     return mSchedule.start === start && mSchedule.end === end && mSchedule.date === date
      //   });
      //   if(schedule.assigned === undefined){
      //     schedule.assigned = [];
      //   }
      //   const isUserAlreadyAssigned = schedule.assigned.find(assignedUser => {
      //     return assignedUser.keycloakID === user.keycloakID
      //   })
      //   if (!isUserAlreadyAssigned){
      //     schedule.assigned.push({
      //       username : `${user.lastname}.${user.firstname}`,
      //       keycloakID: user.keycloakID,
      //       id: user._id,
      //     })
      //   }
      //   let oldFTIndex = this.updatedFTs.findIndex(mFT => mFT._id === FT._id);
      //   if(oldFTIndex === -1){
      //     this.updatedFTs.push(FT)
      //   } else {
      //     this.updatedFTs[oldFTIndex] = FT
      //   }
      // })
    },

    filters: {
      deep: true,

      handler() {
        const filters = this.filters;
        let users = this.users;

        // filter by name
        if (filters.name) {
          let search = filters.name.toLowerCase();
          users = users.filter((user) => {
            let isNickname = false;
            if (user.nickname) {
              isNickname = user.nickname.toLowerCase().includes(search);
            }
            return (
              user.firstname.toLowerCase().includes(search) ||
              user.lastname.toLowerCase().includes(search) ||
              isNickname
            );
          });
        }

        // filter by team
        if (filters.teams.length !== 0) {
          users = users.filter((user) => {
            if (user.team && user.team.length !== 0) {
              let all = true;
              filters.teams.forEach((t) => {
                all = all && user.team.includes(t);
              });
              return all;
            }
            return false;
          });
        }

        this.filteredUsers = users;
      },
    },
  },
};
</script>

<style scoped></style>

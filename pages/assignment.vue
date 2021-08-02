<template>
  <v-container style="left: 0px; width: 100%; margin-left: 0; margin-right: 0; position: absolute; display: flex">

    <div style="display: flex; flex-flow: column">
      <!-- list of  filtered users -->
      <v-card>
        <v-list>
          <v-subheader>Users</v-subheader>
          <v-list-item-group
              v-model="selectedUserIndex"
          >
            <v-list-item v-for="user of filteredUsers">
              <v-list-item-content>
                <h4>{{ user.lastname }} {{ user.firstname }}</h4>
                <!--          <v-chip>{{user.charisma}}</v-chip>-->
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>

      <!-- list of selected user's friend -->
      <v-card v-if="selectedUser && selectedUser.friends">
        <v-list>
          <v-subheader>les amis du user selectionné</v-subheader>
          <v-list-item-group
              v-model="selectedUserFriend"
          >
            <v-list-item v-for="friend of selectedUser.friends">
              <v-list-item-content>
                <h4>{{ friend }}</h4>
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
        style="flex-grow: 2"
        ref="calendar"
        :value="selectedDay"
        :events="selectedUserAvailabilities"
        color="primary"
        type="week"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>

    <div style="display: flex; flex-flow: column">
      <v-date-picker
          v-model="selectedDay"
      ></v-date-picker>

      <!-- list of users -->
      <v-card>
        <v-list>
          <v-subheader>FT</v-subheader>
          <v-list-item-group
              v-model="selectedFTIndex"
          >
            <v-list-item v-for="FT of filteredFTs">
              <v-list-item-content>{{ FT.name }}</v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import {hasRole} from "../common/role";

export default {
  name: "assignment",
  data() {
    return {
      users: [],
      filteredUsers: [],
      selectedUserIndex: undefined,
      selectedFTIndex: undefined,
      selectedUserFriend: undefined,
      selectedDay: undefined,
      FTs: [],
      filteredFTs: [],
    }
  },

  async mounted() {
    if (!hasRole(this, 'hard')) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: '/',
      })
    }

    // user has access to this page
    // get user list
    this.users = (await this.$axios.get('/user')).data;
    this.filteredUsers = this.users;

    // get FTs
    this.FTs = (await this.$axios.get('/FT')).data.data;
    this.filteredFTs = this.FTs;

  },

  methods: {
    getStupidAmericanTimeFormat(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
  },
  computed: {
    selectedUser() {
      return this.users[this.selectedUserIndex]
    },

    selectedFT() {
      return this.users[this.selectedFTIndex]
    },

    selectedUserAvailabilities() {
      let events = [];
      if (this.selectedUser && this.selectedUser.availabilities) {
        let mAvailabilities = this.selectedUser.availabilities;
        if (mAvailabilities.length !== 0) {
          mAvailabilities.forEach(reason => {
            if (reason.days) {
              reason.days.forEach(day => {
                if (day.frames) {
                  day.frames.forEach(frame => {
                    let timeframe = {
                      start: new Date(Date.parse(day.date + ' ' + frame.start)),
                      end: new Date(Date.parse(day.date + ' ' + frame.end))
                    }
                    events.push({
                      name: 'Disponible',
                      start: this.getStupidAmericanTimeFormat(timeframe.start),
                      end: this.getStupidAmericanTimeFormat(timeframe.end),
                    })
                  })
                }
              })
            }
          })
        }
      }
      return events
    }
  }
}
</script>

<style scoped>

</style>
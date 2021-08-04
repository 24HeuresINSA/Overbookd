<template>
  <v-container style="left: 0; max-width: none; margin-left: 0; margin-right: 0; position: absolute; display: flex">

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
      <v-card v-if="getSelectedUser && getSelectedUser.friends">
        <v-list>
          <v-subheader>les amis du user selectionné</v-subheader>
          <v-list-item-group
              v-model="selectedUserFriend"
          >
            <v-list-item v-for="friend of getSelectedUser.friends">
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
              v-model="selectedAssignmentsIndex"
              multiple
          >
            <v-list-item v-for="schedule in filteredSchedules">
              <v-list-item-content>
                {{ schedule.name }} {{schedule.schedule.date}} {{schedule.schedule.start}}➡️{{schedule.schedule.end}}
              </v-list-item-content>
              <v-list-item-icon><v-icon>
                mdi-information
              </v-icon></v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
    <v-btn fab @click="saveAssignment" style="position: fixed; right: 20px; bottom: 40px;z-index: 20">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
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
      selectedAssignmentsIndex: undefined,
      selectedUserFriend: undefined,
      selectedDay: undefined,
      FTs: [],
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
    this.FTs = (await this.$axios.get('/FT')).data.data; // idk but it works
  },

  methods: {
    getStupidAmericanTimeFormat(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },

    getCalendarFormattedAssignedFTsOfSelectedUser(){
      let events = [];
      if(this.getSelectedUser && this.getSelectedUser.assigned !== undefined){
        let assignedFTs = this.getSelectedUser.assigned;
        console.log(assignedFTs)
        assignedFTs.forEach(assignedFT => {
          let start = new Date(Date.parse(assignedFT.schedule.date + ' ' + assignedFT.schedule.start));
          let end =  new Date(Date.parse(assignedFT.schedule.date + ' ' + assignedFT.schedule.end));
          events.push({
            name: assignedFT.name,
            start: this.getStupidAmericanTimeFormat(start),
            end: this.getStupidAmericanTimeFormat(end),
            color: '#ebc034'
          })
        })
      } else {
      }
      return events;
    },

    saveAssignment(){

    }
  },
  computed: {
    getSelectedUser() {
      return this.users[this.selectedUserIndex]
    },

    selectedAssignments() {
      if(this.selectedAssignmentsIndex){
        return this.selectedAssignmentsIndex.map(i => this.filteredSchedules[i])
      }
    },

    filteredSchedules(){
      // FTs that are in the selected users availability
      let filteredSchedules = [];
      let userAvailabilities = [];
      if(this.getSelectedUser){
        this.getSelectedUser.availabilities.forEach(availability => {
          availability.days.forEach(day => {
            day.frames.forEach(frame => {
              userAvailabilities.push({
                start: new Date(Date.parse(day.date + ' ' + frame.start)),
                end: new Date(Date.parse(day.date + ' ' + frame.end))
              })
            })
          })
        })
        userAvailabilities.forEach(timeframe => {
          this.FTs.forEach(FT => {
            if(FT.schedules){
              FT.schedules.forEach(schedule => {
                let start = Date.parse(schedule.date + ' ' + (schedule.start));
                let end = Date.parse(schedule.date + ' ' + (schedule.start));
                if(timeframe.start <= start && timeframe.end >= end) {
                  filteredSchedules.push({
                    name: FT.name,
                    FTID: FT._id,
                    schedule
                  });
                }
              })
            }
          })
        })
      }
      return filteredSchedules
    },

    selectedUserAvailabilities() {
      let events = [];
      if (this.getSelectedUser && this.getSelectedUser.availabilities) {
        let mAvailabilities = this.getSelectedUser.availabilities;
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
      // add assigned events
      const assignedEvents = this.getCalendarFormattedAssignedFTsOfSelectedUser()
      events = events.concat(assignedEvents);
      return events
    }
  },

  watch:{
    selectedAssignments(){
      // selected assignment changed...
      let user = this.getSelectedUser;
      this.$set(user, 'assigned',this.selectedAssignments )
      // save in FT
      this.selectedAssignments
    }
  }
}
</script>

<style scoped>

</style>
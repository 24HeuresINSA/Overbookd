<template>
  <v-container
    style="
      left: 0;
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      position: absolute;
      display: flex;
      height: 100%;
      width: 100%;
    "
  >
    <FilteredUsers
      style="max-width: 350px"
      @selected-user="onSelectedUser"
    ></FilteredUsers>

    <!-- calendar --->
    <OverCalendar
      :center-day="new Date().setDate(new Date().getDate() - 5)"
      :events="calendarDisplayedEvents"
      @delete-assignment="unassign"
      @open-unassign-dialog="openUnassignDialog"
    ></OverCalendar>

    <OverTasks style="max-width: 550px"></OverTasks>

    <v-dialog v-model="isUnassignDialogOpen" width="500px">
      <unassign-dialog @close-dialog="closeUnassignDialog"></unassign-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import FilteredUsers from "../components/filtredUsers";
import OverTasks from "../components/overTasks";
import OverCalendar from "../components/overCalendar";
import ftRepo from "../repositories/ftRepo";
import {safeCall} from "../utils/api/calls";

export default {
  name: "Assignment",
  components: { OverCalendar, OverTasks, FilteredUsers },
  data() {
    return {
      timeslots: [],

      selectedUserFriend: undefined,
      selectedUser: undefined,
      selectedDay: undefined,
      selectedTimeframe: undefined,
      isFeedbackSnackbarOpen: false,
      isInfoDisplayed: false,
      isNewEventDialogOpen: false,
      isAssignmentUpdated: true,
      newEventName: undefined,
      events: [],
      isUnassignDialogOpen: false,

      teams: this.getConfig("teams"),
      timeframes: this.getConfig("timeframes"),
    };
  },

  computed: {
    calendarDisplayedEvents() {
      let events = [];
      if (this.selectedUser) {
        if (this.selectedUser.assigned) {
          // add assigned tasks
          events = this.selectedUser.assigned;
        }
        if (this.selectedUser.availabilities) {
          // add availabilities
          this.selectedUser.availabilities.forEach((availability) => {
            availability.days.forEach((day) => {
              day.frames.forEach((frame) => {
                let existingEvent = events.find((e) => {
                  return (
                    e.name === "Disponible" &&
                    e.schedule.start ===
                      new Date(day.date + " " + frame.start) &&
                    e.end === new Date(day.date + " " + frame.end)
                  );
                });
                if (!existingEvent) {
                  events.push({
                    name: "Disponible",
                    color: "rgba(92,138,217,0.56)",
                    schedule: {
                      start: new Date(day.date + " " + frame.start),
                      end: new Date(day.date + " " + frame.end),
                    },
                  });
                }
              });
            });
          });
        }
      }

      return events;
    },

    availableTimeslots() {
      if (this.selectedUser && this.selectedUser.availabilities) {
        return this.selectedUser.availabilities.map((_id) => {
          return this.timeslots.find((timeslot) => timeslot._id === _id);
        });
      }
      return [];
    },
  },

  watch: {
    selectedTimeframe() {
      const selectedDayTimestamp = this.timeframes.find(
          (e) => e.name === this.selectedTimeframe
      );
      if (selectedDayTimestamp) {
        this.selectedDay = selectedDayTimestamp.day;
      }
    },

    selectedAssignments() {
    },
  },

  async mounted() {
    if (!(await this.hasRole("hard"))) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }

    await this.$accessor.assignment.initStore();

    const res = await safeCall(this.$store, ftRepo.getAllFTs(this));
    if (res) {
      this.FTs = res.data;
    }
  },

  methods: {
    openUnassignDialog() {
      this.isUnassignDialogOpen = true;
    },
    async hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },
    async addTask(timeframe, FT) {
      if (!this.selectedUser.assigned) {
        this.selectedUser.assigned = [];
      }
      const assignmentID = this.uuidv4();
      timeframe._id = assignmentID;
      this.selectedUser.assigned.push(timeframe);
      await this.saveUser();
      await this.saveFT(assignmentID, timeframe.FTID, FT);
    },

    async saveUser() {
      return this.$axios.put(`/user/${this.selectedUser._id}`, {
        assigned: this.selectedUser.assigned.filter((e) => e.FTID),
      });
    },

    async saveFT(assignmentID, FTID, FT) {
      const newSchedule = this.selectedUser.assigned.find(
        (e) => e.FTID === FTID
      ); // the schedule that needs to be added to the FT
      if (newSchedule) {
        let schedules = FT.schedules;
        let concernedSchedule = schedules.find((s) => {
          const start = new Date(s.start);
          const end = new Date(s.end);
          return (
            start.getTime() === newSchedule.schedule.start.getTime() &&
            end.getTime() === newSchedule.schedule.end.getTime()
          );
        });
        if (concernedSchedule) {
          if (!concernedSchedule.assigned) {
            concernedSchedule.assigned = [];
          }
          concernedSchedule.assigned.push({
            _id: assignmentID,
            userID: this.selectedUser._id,
            username:
              this.selectedUser.firstname + "." + this.selectedUser.lastname,
          });
        }
        return this.$axios.put("/ft", {
          _id: FTID,
          schedules,
        });
      }
    },

    async unassign(timeframe) {
      if (this.selectedUser.assigned) {
        this.selectedUser.assigned = this.selectedUser.assigned.filter(
          (assignedTask) => assignedTask.FTID !== timeframe.FTID
        );
        // save in database
        // save user
        await this.$axios.$put(`user/${this.selectedUser._id}`, {
          assigned: this.selectedUser.assigned,
        });
        // save ft
        await this.$axios.put("FT/unassign", timeframe);
      }
    },

    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    onSelectedUser(user) {
      this.$accessor.assignment.setCurrentUser(user);
      this.selectedUser = user;
    },

    closeUnassignDialog() {
      this.isUnassignDialogOpen = false;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
}
</style>

<template>
  <div>
    <v-card v-if="user">
      <v-img
          v-if="user.pp"
          :src="getPPUrl() + 'api/user/pp/' + user.pp"
          max-height="200px"
      ></v-img>
      <v-card-title
      >{{ user.firstname }}.{{
          user.lastname
        }}
      </v-card-title>
      <v-card-text>
        <list-tasks @selected-task="addTask" :tasks="availableTasks"></list-tasks>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// list tasks that are assigned to user and available tasks
import ListTasks from "./listTasks";

export default {
  name: "overTasks",
  components: {ListTasks},
  props: ['user'],

  data() {
    return {
      FTs: [],
    }
  },

  async mounted() {
    this.FTs = (await this.$axios.get("/FT")).data.data; // idk but it works
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
          ? "http://localhost:2424/"
          : "";
    },
    addTask(task) {
      this.$emit('add-task', {
        name: task.name,
        FTID: task.FTID,
        schedule: {
          start: new Date(task.schedule.start),
          end: new Date(task.schedule.end),
        }
      }, this.FTs.find(FT => FT._id === task.FTID))
    },
  },

  computed: {
    availableTasks() {
      // tasks that can be assigned to the selected user given his availabilities 
      let filteredTasks = [];
      let userAvailabilities = [];

      if (this.user && this.user.availabilities) {
        this.user.availabilities.forEach((availability) => {
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
                let start = Date.parse(schedule.start);
                let end = Date.parse(schedule.end);
                if (timeframe.start <= start && timeframe.end >= end) {
                  filteredTasks.push({
                    name: FT.name,
                    FTID: FT._id,
                    schedule,
                  });
                }
              });
            }
          });
        });
        // add comments
        if (this.user.assigned) {
          const comments = this.user.assigned.filter(e => !e.FTID)
          filteredTasks.concat(comments)
        }
      }

      // remove assigned tasks
      filteredTasks = filteredTasks.filter(task => {
        if (task.FTID) {
          if (this.user.assigned) {
            const FTIndex = this.user.assigned.map(e => e.FTID).indexOf(task.FTID);
            return FTIndex === -1;
          }
          return false
        }
      })

      this.$emit('events', filteredTasks)
      return filteredTasks
    }
  }
}
</script>

<style scoped>

</style>
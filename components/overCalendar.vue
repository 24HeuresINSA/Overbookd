<template>
  <v-calendar
      style="flex-grow: 2; height: auto; overflow-y: auto"
      ref="calendar"
      :value="centerDay"
      :events="calendarFormattedEvents"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      @mousedown:event="startDrag"
      @mousedown:time="startTime"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseleave.native="cancelDrag"
  ></v-calendar>
</template>

<script>
export default {
  name: "overCalendar",
  props: ['centerDay', 'events'],

  data() {
    return {
      // calendar drag and drop
      dragEvents: [],
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,

      newEvent: undefined
    }
  },

  methods: {
    // calendar drag and drop
    startDrag({event, timed}) {
      console.log(event, timed);
      this.$emit('delete-assignment', event);
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        let d = new Date(this.createStart)
        this.createEvent = {
          name: `Event `,
          startTimestamp: this.createStart,
          endTimestamp: this.createStart,
          date: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
          start: `${d.getHours()}:${d.getMinutes()}`,
          end: `${d.getHours()}:${d.getMinutes()}`,
          timed: true,
        }

        this.getSelectedUser.assigned.push({name: `Event `, schedule: this.createEvent})
      }
    },
    extendBottom(event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)
      if (this.getSelectedUser && this.getSelectedUser.assigned) {
        const lastEvent = this.getSelectedUser.assigned[this.getSelectedUser.assigned.length - 1].schedule
        if (lastEvent) {
          if (lastEvent && this.dragTime !== null) {
            const start = lastEvent.startTimestamp
            const end = lastEvent.endTimestamp
            const duration = end - start
            const newStartTime = mouse - this.dragTime
            const newStart = this.roundTime(newStartTime)
            const newEnd = newStart + duration

            lastEvent.startTimestamp = newStart
            lastEvent.endTimestamp = newEnd

            let s = new Date(lastEvent.startTimestamp);
            let e = new Date(lastEvent.endTimestamp);

            lastEvent.start = `${s.getHours()}:${s.getMinutes()}`;
            lastEvent.end = `${e.getHours()}:${e.getMinutes()}`;

          } else if (this.createEvent && this.createStart !== null) {
            const mouseRounded = this.roundTime(mouse, false)

            const min = Math.min(mouseRounded, this.createStart)
            const max = Math.max(mouseRounded, this.createStart)

            lastEvent.startTimestamp = min
            lastEvent.endTimestamp = max

            let s = new Date(lastEvent.startTimestamp);
            let e = new Date(lastEvent.endTimestamp);

            lastEvent.start = `${s.getHours()}:${s.getMinutes()}`;
            lastEvent.end = `${e.getHours()}:${e.getMinutes()}`;
          }
        }
      }
    },
    endDrag() {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
      this.isNewEventDialogOpen = true;

    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          // const i = this.events.indexOf(this.createEvent)
          // if (i !== -1) {
          //   this.events.splice(i, 1)
          // }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },
    roundTime(time, down = true) {
      const roundTo = 15 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },
    toTime(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    getStupidAmericanTimeFormat(date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    // saveNewEventName() {
    //   this.getSelectedUser.assigned[this.getSelectedUser.assigned.length - 1].name = this.newEventName;
    //   this.isNewEventDialogOpen = false;
    // },
  },

  computed: {
    calendarFormattedEvents() {
      if (this.events) {
        return this.events.map(e => {
          e.start = this.getStupidAmericanTimeFormat(e.schedule.start);
          e.end = this.getStupidAmericanTimeFormat(e.schedule.end);
          return e
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
<template>
    <div>
        <v-calendar
        :now="dateToString(today)"
        :value="dateToString(today)"
        :events="computedEvents"
        :weekdays="weekdays"
        color="primary"
        type="week"
        >
        </v-calendar>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";

declare interface DetailsCalendarProps {
  name: string;
  start: Date;
  end: Date;
}

declare interface DetailsCalendarData {
  name: string;
  start: string;
  end: string;
}

export default Vue.extend({
    name: "DetailsCalendar",
    props: {
        // @ts-ignore
        calendarEvents: {
            type: Array as PropType<DetailsCalendarProps[]>,
            required: true
        },
    },
    data(): any {
        return {
            today: new Date(2020, 0, 3),
            weekdays: [1,2,3,4,5,6,0],
        };
    },
    computed: {
        computedEvents(): DetailsCalendarData[] {
            return this.calendarEvents.map((e: DetailsCalendarProps) => {
                return {
                    name: e.name,
                    start: this.dateToString(e.start),
                    end: this.dateToString(e.end)
                };
            });
        }
    },
    methods: {
        dateToString(m: Date): string {
            return m.getUTCFullYear() + "-" +
                ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
                ("0" + m.getUTCDate()).slice(-2) + " " +
                ("0" + m.getUTCHours()).slice(-2) + ":" +
                ("0" + m.getUTCMinutes()).slice(-2) + ":" +
                ("0" + m.getUTCSeconds()).slice(-2);
        }
    }
});
</script>

<style>

</style>
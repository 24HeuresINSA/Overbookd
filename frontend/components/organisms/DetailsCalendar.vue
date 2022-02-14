<template>
    <div>
        <v-calendar
        :now="dateToString(now)"
        :value="dateToString(now)"
        :events="computedEvents"
        :weekdays="weekdays"
        :event-color="getEventColor"
        color="primary"
        type="week"
        >
        </v-calendar>
    </div>
</template>

<script lang="ts">
/**
 * Props for this component:
 * calendarEvents - List of event as describe by interface DetailsCalendarProps
 * weekdays - List of weekdays as describe by interface Weekdays
 *      A minimum of 4 weekdays is required or the display becomes broken
 *      0 is sunday, 6 is saturday (american style)
 * now - Date of the day you want to primarly display (as new Date())
 */

import Vue, {PropType} from "vue";

declare interface DetailsCalendarProps {
  name: string;
  start: Date;
  end: Date;
  color?: string;
}

declare interface DetailsCalendarData {
  name: string;
  start: string;
  end: string;
  color?: string;
}

export default Vue.extend({
    name: "DetailsCalendar",
    props: {
        // @ts-ignore
        calendarEvents: {
            type: Array as PropType<DetailsCalendarProps[]>,
            required: true
        },
        weekdays: {
            type: Array as PropType<number[]>,
            default: () => [1, 2, 3, 4, 5, 6, 0]
        },
        now: {
            type: Date,
            default: () => new Date()
        }
    },
    data(): any {
        return {
        };
    },
    computed: {
        computedEvents(): DetailsCalendarData[] {
            return this.calendarEvents.map((e: DetailsCalendarProps) => {
                return {
                    name: e.name,
                    start: this.dateToString(e.start),
                    end: this.dateToString(e.end),
                    color: e.color,
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
        },
        getEventColor(e: DetailsCalendarData): string {
            return e.color || "primary";
        }
    },
});
</script>

<style>

</style>
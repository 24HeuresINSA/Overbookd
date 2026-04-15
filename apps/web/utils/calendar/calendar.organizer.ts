import { Period } from "@overbookd/time";
import type { CalendarEvent } from "./event";

export type DisplayableCalendarEvent = CalendarEvent & {
  period: Period;
  startColumn: number;
  endColumn: number;
  columnCount: number;
};

type CalendarEventColumns = DisplayableCalendarEvent[][];
type CalendarEventColumnsFiller = {
  displayableEvents: DisplayableCalendarEvent[];
  columnsBuffer: CalendarEventColumns;
};

export class CalendarEventOrganizer {
  constructor(private readonly events: CalendarEvent[]) {}

  get displayableEvents(): DisplayableCalendarEvent[] {
    const sortedEvents = this.events.sort((a, b) => {
      if (a.start.getTime() !== b.start.getTime())
        return a.start.getTime() - b.start.getTime();

      if (a.end.getTime() !== b.end.getTime())
        return b.end.getTime() - a.end.getTime();

      return a.id.localeCompare(b.id);
    });

    const { displayableEvents, columnsBuffer } =
      sortedEvents.reduce<CalendarEventColumnsFiller>(
        ({ displayableEvents, columnsBuffer }, event) => {
          const isNonOverlappingEvent = columnsBuffer.every((eventColumn) => {
            const lastEvent = eventColumn.at(-1);
            return lastEvent === undefined || lastEvent.end <= event.start;
          });
          if (columnsBuffer.length > 0 && isNonOverlappingEvent) {
            displayableEvents.push(...this.emptyBuffer(columnsBuffer));
            columnsBuffer = [];
          }

          const eventColumnIndex = columnsBuffer.findIndex((events) => {
            const columnEvent = events.at(-1);
            return columnEvent === undefined || columnEvent.end <= event.start;
          });

          const startColumn =
            eventColumnIndex === -1 ? columnsBuffer.length : eventColumnIndex;
          const displayableEvent: DisplayableCalendarEvent = {
            ...event,
            period: Period.init({ start: event.start, end: event.end }),
            startColumn,
            endColumn: startColumn + 1,
            columnCount: columnsBuffer.length,
          };

          if (eventColumnIndex === -1) {
            columnsBuffer.push([displayableEvent]);
          } else {
            columnsBuffer.at(eventColumnIndex)!.push(displayableEvent);
          }

          return { displayableEvents, columnsBuffer };
        },
        { displayableEvents: [], columnsBuffer: [] },
      );

    displayableEvents.push(...this.emptyBuffer(columnsBuffer));

    return displayableEvents;
  }

  private emptyBuffer(
    columnsBuffer: CalendarEventColumns,
  ): DisplayableCalendarEvent[] {
    const tempDisplayableEvents = columnsBuffer.flat();
    const displayableEvents = tempDisplayableEvents.reduce<
      DisplayableCalendarEvent[]
    >((cleanedDisplayableEvents, displayableEvent) => {
      const endColumnAddition = columnsBuffer
        .slice(displayableEvent.endColumn)
        .findIndex((events) =>
          events.some((event) =>
            displayableEvent.period.isOverlapping(event.period),
          ),
        );
      const endColumn =
        endColumnAddition === -1
          ? columnsBuffer.length
          : displayableEvent.endColumn + endColumnAddition;

      const cleanedDisplayableEvent: DisplayableCalendarEvent = {
        ...displayableEvent,
        endColumn,
        columnCount: columnsBuffer.length,
      };
      cleanedDisplayableEvents.push(cleanedDisplayableEvent);

      return cleanedDisplayableEvents;
    }, []);

    return displayableEvents;
  }
}

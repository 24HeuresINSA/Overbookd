import { IProvidePeriod, ONE_MINUTE_IN_MS } from "@overbookd/period";

export type TimeWindow = IProvidePeriod & {
  id: string;
};

export function readablePeriodFrom({ start, end }: IProvidePeriod): string {
  const locales = "fr-FR";
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const startString = start.toLocaleDateString(locales, options);
  const endString = end.toLocaleDateString(locales, options);
  return `${startString} au ${endString}`;
}

export function readablePeriodFromId(id: TimeWindow["id"]): string {
  console.log(id.split("-"));
  const startTimestamp = parseInt(id.split("-")[0]) * ONE_MINUTE_IN_MS;
  const endTimestamp = parseInt(id.split("-")[1]) * ONE_MINUTE_IN_MS;
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);
  return readablePeriodFrom({ start, end });
}

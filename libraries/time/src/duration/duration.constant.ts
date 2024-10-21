export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;
export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;

export const ONE_SECOND_IN_MS = 1000;
export const ONE_MINUTE_IN_MS = ONE_SECOND_IN_MS * 60;
export const QUARTER_IN_MS = 15 * ONE_MINUTE_IN_MS;
export const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * MINUTES_IN_HOUR;
export const TWO_HOURS_IN_MS = 2 * ONE_HOUR_IN_MS;
export const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
export const ONE_YEAR_IN_MS = ONE_DAY_IN_MS * 365;
export const THIRTY_SECONDS_IN_MS = 30 * ONE_SECOND_IN_MS;
export const ONE_WEEK_IN_MS = ONE_DAY_IN_MS * DAYS_IN_WEEK;

export const ONE_DAY_IN_SECONDS = ONE_DAY_IN_MS / ONE_SECOND_IN_MS;
export const ONE_WEEK_IN_SECONDS = 7 * ONE_DAY_IN_SECONDS;

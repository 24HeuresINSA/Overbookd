import {
  type DomainEvent,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
  FESTIVAL_TASK_CREATED,
  FESTIVAL_TASK_READY_TO_REVIEW,
  FESTIVAL_TASK_REJECTED,
  FESTIVAL_TASK_APPROVED,
  FESTIVAL_TASK_IGNORED,
  FESTIVAL_TASK_READY_TO_ASSIGN,
  type HandleEvent,
  addEventListener,
} from "@overbookd/domain-events";

export function useLiveNotification() {
  const mine = buildMineContext();
  const festivalActivities = buildFestivalActivitiesContext();
  const festivalTasks = buildFestivalTasksContext();
  return { mine, festivalActivities, festivalTasks };
}

function generateMineEndpoint() {
  const { accessToken } = useAuthStore();
  const liveEndpoint = generateEndpoint("mine");
  liveEndpoint.searchParams.append("token", accessToken ?? "");
  return liveEndpoint.href;
}

function generateEndpoint(notification: string) {
  const config = useRuntimeConfig();
  const path = `${config.public.baseURL}/live-notifications/${notification}`;
  return new URL(path);
}

function buildMineContext() {
  const source = new EventSource(generateMineEndpoint());
  return {
    listen<T extends DomainEvent["type"]>(
      type: T,
      handler: HandleEvent<T>,
    ): void {
      addEventListener(source, type, handler);
    },
    stopListening(): void {
      source.close();
    },
  };
}

type FestivalActivityEvent =
  | typeof FESTIVAL_ACTIVITY_CREATED
  | typeof FESTIVAL_ACTIVITY_READY_TO_REVIEW
  | typeof FESTIVAL_ACTIVITY_APPROVED
  | typeof FESTIVAL_ACTIVITY_REJECTED;

function buildFestivalActivitiesContext() {
  const source = new EventSource(generateEndpoint("festival-activities"));
  return {
    listen<T extends FestivalActivityEvent>(
      type: T,
      handler: HandleEvent<T>,
    ): void {
      addEventListener(source, type, handler);
    },
    stopListening(): void {
      source.close();
    },
  };
}

type FestivalTaskEvent =
  | typeof FESTIVAL_TASK_CREATED
  | typeof FESTIVAL_TASK_READY_TO_REVIEW
  | typeof FESTIVAL_TASK_REJECTED
  | typeof FESTIVAL_TASK_APPROVED
  | typeof FESTIVAL_TASK_IGNORED
  | typeof FESTIVAL_TASK_READY_TO_ASSIGN;

function buildFestivalTasksContext() {
  const source = new EventSource(generateEndpoint("festival-tasks"));
  return {
    listen<T extends FestivalTaskEvent>(
      type: T,
      handler: HandleEvent<T>,
    ): void {
      addEventListener(source, type, handler);
    },
    stopListening(): void {
      source.close();
    },
  };
}

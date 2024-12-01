import {
  type DomainEvent,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
  type HandleEvent,
  addEventListener,
} from "@overbookd/domain-events";

export function useLiveNotification() {
  const mine = buildMineContext();
  const festivalActivities = buildFestivalActivitiesContext();
  return { mine, festivalActivities };
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

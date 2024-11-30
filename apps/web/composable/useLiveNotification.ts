import {
  type DomainEvent,
  type HandleEvent,
  addEventListener,
} from "@overbookd/domain-events";

export function useLiveNotification() {
  const mine = buildMineContext();
  return { mine };
}

function generateEndpoint() {
  const { accessToken } = useAuthStore();
  const config = useRuntimeConfig();
  const path = `${config.public.baseURL}/live-notifications/mine`;
  const liveEndpoint = new URL(path);
  liveEndpoint.searchParams.append("token", accessToken ?? "");
  return liveEndpoint.href;
}

function buildMineContext() {
  const source = new EventSource(generateEndpoint());
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

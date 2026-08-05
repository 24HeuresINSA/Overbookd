import {
  type DomainEvent,
  type HandleEvent,
  addEventListener,
} from "@overbookd/domain-events";
import { useOidcUtils } from "./useOidcUtils";

let sharedSource: EventSource | null = null;

export function useLiveNotification() {
  if (!sharedSource || sharedSource.readyState === EventSource.CLOSED) {
    const config = useRuntimeConfig();
    const url = new URL(`${config.public.apiURL}/live-notifications/stream`);

    const { userAccessToken } = useOidcUtils();
    url.searchParams.append("token", userAccessToken.value ?? "");
    sharedSource = new EventSource(url.href);
  }

  function listen<T extends DomainEvent["type"]>(
    type: T,
    handler: HandleEvent<T>,
  ): void {
    if (!sharedSource) return;
    addEventListener(sharedSource, type, handler);
  }

  function stopListening(): void {
    if (!sharedSource) return;
    sharedSource.close();
    sharedSource = null;
  }

  return { listen, stopListening };
}

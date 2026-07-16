import {
  type DomainEvent,
  type HandleEvent,
  addEventListener,
} from "@overbookd/domain-events";

let sharedSource: EventSource | null = null;

export function useLiveNotification() {
  if (!sharedSource || sharedSource.readyState === EventSource.CLOSED) {
    const config = useRuntimeConfig();
    const url = new URL(`${config.public.apiURL}/live-notifications/stream`);

    const oidc = useOidcAuth();
    const accessToken = oidc.user.value?.accessToken ?? "";
    url.searchParams.append("token", accessToken);
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

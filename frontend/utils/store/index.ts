import { NotificationsActions } from "~/store/notif";
import { UserActions } from "~/store/user";
import { DialogActions } from "~/store/dialog";

// Populate with stores actions types
interface Stores {
  notif: NotificationsActions;
  user: UserActions;
  dialog: DialogActions;
}

/**
 * @deprecated
 * Wrapper to add types and autocomplete to vuex dispatch
 * @param context Vue context
 * @param scope module name
 * @param action action name
 * @param data action payload
 * @returns action dipacth trigger
 */
export function dispatch<K extends keyof Stores, T extends keyof Stores[K]>(
  context: Vue,
  scope: K,
  action: T,
  data: Stores[K][T]
) {
  return context.$store.dispatch(`${scope}/${String(action)}`, data);
}

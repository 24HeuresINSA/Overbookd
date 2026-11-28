import { useDebounceFn } from "@vueuse/core";
import type { WritableComputedRef } from "vue";

const DEFAULT_DEBOUNCE_MS = 800;

export function useDebouncedModel<T>(
  stored: () => T,
  save: (value: T) => void,
  debounceMs: number = DEFAULT_DEBOUNCE_MS,
): WritableComputedRef<T> {
  const draft = shallowRef<T>(stored());
  const hasPendingEdit = shallowRef<boolean>(false);

  watch(stored, (storedValue) => {
    if (hasPendingEdit.value) return;
    draft.value = storedValue;
  });

  const debouncedSave = useDebounceFn((value: T) => {
    hasPendingEdit.value = false;
    save(value);
  }, debounceMs);

  return computed<T>({
    get: () => draft.value,
    set: (value) => {
      draft.value = value;
      hasPendingEdit.value = true;
      debouncedSave(value);
    },
  });
}

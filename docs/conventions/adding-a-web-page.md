# Adding a web page

> _What this page covers:_ A recipe for adding a new page in `apps/web` — route, page component, composables, store, repository.
> _Who it's for:_ Anyone shipping a new screen.

For the why and the wider anatomy, read [`docs/architecture/web-anatomy.md`](../architecture/web-anatomy.md) first.

## The shape

A new page typically touches:

1. `apps/web/pages/...vue` — the route + page component.
2. `apps/web/components/...vue` — at least one component used by the page.
3. `apps/web/composable/use*.ts` — a composable bridging the component and the store.
4. `apps/web/stores/*.ts` — Pinia store with state and actions.
5. `apps/web/repositories/*.ts` — typed wrapper around the API client.
6. `apps/web/middleware/*.ts` — only if the page has special access rules.

## 1. Add the route

Nuxt uses file-based routing. Drop a Vue file in `apps/web/pages/` to create a route:

| File | Route |
|---|---|
| `pages/festival-activities/index.vue` | `/festival-activities` |
| `pages/festival-activities/[id].vue` | `/festival-activities/:id` |
| `pages/admin/users/[id]/edit.vue` | `/admin/users/:id/edit` |

The page component should be thin — wire up a composable and render.

## 2. Compose the data

```ts
// apps/web/composable/festivalActivity/useFestivalActivity.ts
import { storeToRefs } from "pinia";
import { useFestivalActivityStore } from "~/stores/festivalActivity";

export function useFestivalActivity(id: number) {
  const store = useFestivalActivityStore();
  const { byId, loading, error } = storeToRefs(store);

  onMounted(() => store.fetchOne(id));

  return {
    activity: computed(() => byId.value[id]),
    loading,
    error,
  };
}
```

Composables own the lifecycle of the data (when to fetch, when to refresh). Pages and components consume them.

## 3. Define the store

```ts
// apps/web/stores/festivalActivity.ts
import { defineStore } from "pinia";
import { festivalActivityRepository } from "~/repositories/festivalActivity";

export const useFestivalActivityStore = defineStore("festivalActivity", () => {
  const byId = ref<Record<number, FestivalActivity>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOne(id: number) {
    loading.value = true;
    error.value = null;
    try {
      byId.value[id] = await festivalActivityRepository.findById(id);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  return { byId, loading, error, fetchOne };
});
```

Stores hold reactive state and orchestrate repositories. Don't put fetch calls in components — go through a store.

## 4. Define the repository

```ts
// apps/web/repositories/festivalActivity.ts
import { http } from "@overbookd/http";

export const festivalActivityRepository = {
  async findById(id: number): Promise<FestivalActivity> {
    return http.get<FestivalActivity>(`/festival-activities/${id}`);
  },
};
```

Repositories are the only layer that knows about HTTP URLs. Errors propagate as exceptions — let the store map them to user-facing state.

## 5. Render the page

```vue
<!-- apps/web/pages/festival-activities/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const id = Number(route.params.id);
const { activity, loading, error } = useFestivalActivity(id);
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error">{{ error }}</div>
  <FestivalActivityDetail v-else-if="activity" :activity="activity" />
</template>
```

Pages render. Composables fetch. Stores cache. Repositories call.

## 6. Permissions and auth

If the page is auth-walled or requires a permission, add a middleware:

```ts
// apps/web/middleware/canSeeFestivalActivities.ts
export default defineNuxtRouteMiddleware(() => {
  const { hasPermission } = useAuth();
  if (!hasPermission(READ_FA)) {
    return navigateTo("/forbidden");
  }
});
```

Reference the middleware from the page:

```vue
<script setup lang="ts">
definePageMeta({ middleware: ["canSeeFestivalActivities"] });
</script>
```

## 7. Verify locally

```bash
pnpm dev:start
# open https://overbookd.traefik.me and navigate to your route
```

Walk the golden path and one or two edge cases (empty state, error state, denied access). Type checks and unit tests verify code correctness; only manual use verifies feature correctness.

## Common mistakes

| Smell | Fix |
|---|---|
| Component fetches directly via `fetch` / `$fetch` | Go through a repository → store |
| Page contains business logic | Push it into a composable or the API |
| Repository returns a Prisma-shaped response | Map to a domain type at the repository boundary |
| Store leaks loading/error state for unrelated entities | Per-entity stores, or scoped state |
| Middleware called from a `setup()` instead of `definePageMeta` | Use the Nuxt middleware mechanism |

## See also

- [`docs/architecture/web-anatomy.md`](../architecture/web-anatomy.md)
- [`docs/conventions/code-style.md`](./code-style.md)
- [Nuxt 4 routing docs](https://nuxt.com/docs/guide/directory-structure/pages)
- [Pinia docs](https://pinia.vuejs.org/)

---

_Last reviewed: 2026-05_

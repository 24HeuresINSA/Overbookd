import type { Route } from 'vue-router';
import { accessorType } from '~/store';

export type NuxtContext = {
  route: Route;
  redirect: (path?: string) => void;
  store: {
    $accessor: typeof accessorType;
  };
};

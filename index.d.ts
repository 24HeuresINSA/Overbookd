/* eslint-disable no-unused-vars */
import { accessorType } from "~/store";
import { safeCall } from "utils/api/calls";

declare module "vue/types/vue" {
  interface Vue {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
  }
}

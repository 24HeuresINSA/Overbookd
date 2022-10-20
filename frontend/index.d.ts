import Vue from "vue";
import { accessorType } from "~/store";
import { safeCall } from "utils/api/calls";

declare module "vue/types/vue" {
  export interface Vue {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
  }
}

declare module "vue/types/options" {
  export interface ComponentOptions<V extends Vue> {
    auth?: boolean;
  }
}

declare module "@nuxt/types" {
  export interface NuxtAppOptions {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
  }
}

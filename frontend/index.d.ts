import Vue from "vue";
import { accessorType } from "~/store";
import { safeCall } from "utils/api/calls";

interface AuthOptions {
  data: any;
}

interface Auth {
  logout: () => Promise<void>;
  loginWith: (startegy: "local", options: AuthOptions) => Promise<void>;
  loggedIn: boolean;
}

declare module "vue/types/vue" {
  export interface Vue {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
    $auth: Auth;
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
    $auth: Auth;
  }
}

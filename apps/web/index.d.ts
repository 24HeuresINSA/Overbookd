import { safeCall } from "utils/api/calls";
import { Store } from "vuex";
import Vue from "vue";
import { accessorType } from "~/store";

interface AuthOptions {
  data: object;
}

interface AuthStrategy {
  token: GetterSetter<string>;
  refreshToken: GetterSetter<string>;
}

interface GetterSetter<T> {
  get: () => T | undefined;
  set: (value: T) => void;
}

interface Auth {
  logout: () => Promise<void>;
  loginWith: (startegy: "local", options: AuthOptions) => Promise<void>;
  loggedIn: boolean;
  strategy: AuthStrategy;
}

declare module "vue/types/vue" {
  export interface Vue {
    $accessor: typeof accessorType;
    $safeCall: typeof safeCall;
    $auth: Auth;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is vuex definition of Store
    $store: Store<any>;
  }
}

declare module "vue/types/options" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- V is used on other definitions and we need definitions to match each others
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

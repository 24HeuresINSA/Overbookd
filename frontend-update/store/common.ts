import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const useStore = defineStore("common", {
  state: () => ({
    user: useUserStore(),
  }),
});

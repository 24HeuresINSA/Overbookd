import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    firstname: "",
    lastname: "",
  }),
  getters: {
    fullName(): string {
      return `${this.firstname} ${this.lastname}`;
    },
  },
  actions: {
    setFirstname(firstname: string) {
      this.firstname = firstname;
    },
    setLastname(lastname: string) {
      this.lastname = lastname;
    }
  },
});
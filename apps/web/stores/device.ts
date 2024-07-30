type State = {
  isDesktop: boolean;
};

export const useDeviceStore = defineStore("device", {
  state: (): State => ({
    isDesktop: true,
  }),
  actions: {
    setDesktop(isDesktop: boolean) {
      this.isDesktop = isDesktop;
    },
  },
});

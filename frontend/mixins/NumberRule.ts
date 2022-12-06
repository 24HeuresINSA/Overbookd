import Vue from "vue/types/umd";

export default Vue.mixin({
  data: () => ({
    numberRule: function (value: string) {
      return [
        !isNaN(parseInt(value, 10)) || "La valeur doit être un nombre",
        parseInt(value, 10) >= 1 || "La valeur doit être supérieure à 0",
      ];
    },
  }),
});

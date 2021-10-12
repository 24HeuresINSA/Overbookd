import SnackNotification from "./snackNotification.vue";

export default {
  title: "Atoms/SnackNotification",
  component: SnackNotification,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SnackNotification },
  template:
    '<SnackNotification :set-timeout="setTimeout" :set-message="setMessage"/>',
});

export const Classic = Template.bind({});
Classic.args = {
  setTimeout: 2000,
  setMessage: "Areuh",
};

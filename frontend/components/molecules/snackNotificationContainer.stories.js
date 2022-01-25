import SnackNotificationContainer from "./snackNotificationContainer.vue";

export default {
  title: "Molecules/SnackNotificationContainer",
  component: SnackNotificationContainer,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SnackNotificationContainer },
  template: '<SnackNotificationContainer :toggle="toggle" />',
});

export const Classic = Template.bind({});
Classic.args = {
  toggle: false,
};

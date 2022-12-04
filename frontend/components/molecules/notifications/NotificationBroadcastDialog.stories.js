import NotificationBroadcastDialog from "./NotificationBroadcastDialog.vue";

export default {
  title: "Molecules/NotificationBroadcastDialog",
  component: NotificationBroadcastDialog,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NotificationBroadcastDialog },
  template: "<NotificationBroadcastDialog />",
});

export const Classic = Template.bind({});
Classic.args = {};

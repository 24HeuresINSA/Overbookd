import NotificationBroadcastDialog from "./notificationBroadcastDialog.vue";

export default {
  title: "Molecules/NotificationBroadcastDialog",
  component: NotificationBroadcastDialog,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NotificationBroadcastDialog },
  template:
    '<NotificationBroadcastDialog :initialIsBroadcastDialogOpen="init"/>',
});

export const Classic = Template.bind({});
Classic.args = {
  init: true,
};

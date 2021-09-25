import NotificationCard from "./notificationCard.vue";

export default {
  title: "Molecules/NotificationCard",
  component: NotificationCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NotificationCard },
  template: '<NotificationCard :notif="notif"/>',
});

export const Broadcast = Template.bind({});
Broadcast.args = {};
